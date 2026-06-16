package main

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
)

type Evidence struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	UploadedAt string `json:"uploadedAt"`
}

type Requirement struct {
	ID            string     `json:"id"`
	Category      string     `json:"category"`
	Title         string     `json:"title"`
	Status        string     `json:"status"`
	EvidenceCount int        `json:"evidenceCount"`
	Evidence      []Evidence `json:"evidence"`
	ETag          string     `json:"etag"`
}

type Category struct {
	ID           string        `json:"id"`
	Name         string        `json:"name"`
	Requirements []Requirement `json:"requirements"`
}

type Response struct {
	Categories []Category `json:"categories"`
}

const dataFile = "./src/api/requirements.json"

var (
	data Response
	mu   sync.Mutex
)

// -----------------------------
// HASH (ETAG)
// -----------------------------
func hash(s string) string {
	h := sha1.Sum([]byte(s))
	return hex.EncodeToString(h[:])
}

// -----------------------------
// LOAD DATA
// -----------------------------
func loadData() error {
	file, err := os.Open(dataFile)
	if err != nil {
		return err
	}
	defer file.Close()

	if err := json.NewDecoder(file).Decode(&data); err != nil {
		return err
	}

	recomputeETags()

	return nil
}

// -----------------------------
// SAVE DATA (FIXED MISSING PIECE)
// -----------------------------
func saveData() error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(dataFile, b, 0644)
}

// -----------------------------
// RECOMPUTE DERIVED FIELDS
// -----------------------------
func recomputeETags() {
	for ci := range data.Categories {
		for ri := range data.Categories[ci].Requirements {

			req := &data.Categories[ci].Requirements[ri]

			req.EvidenceCount = len(req.Evidence)

			payload, _ := json.Marshal(req.Evidence)

			req.ETag = hash(
				req.ID +
					req.Status +
					req.Title +
					string(payload),
			)
		}
	}
}

// -----------------------------
// CORS MIDDLEWARE
// -----------------------------
func cors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// -----------------------------
// GET ALL REQUIREMENTS
// -----------------------------
func getRequirements(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

// -----------------------------
// CATEGORY HANDLER
// -----------------------------
func categoryHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	w.Header().Set("Content-Type", "application/json")

	id := strings.TrimPrefix(r.URL.Path, "/api/categories/")

	if id == "" {
		http.Error(w, "missing category id", http.StatusBadRequest)
		return
	}

	for ci := range data.Categories {
		cat := &data.Categories[ci]

		if cat.ID != id {
			continue
		}

		switch r.Method {

		case http.MethodGet:
			json.NewEncoder(w).Encode(cat)
			return

		case http.MethodPost:
			var payload struct {
				Requirements []Requirement `json:"requirements"`
			}

			if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
				http.Error(w, "invalid json", http.StatusBadRequest)
				return
			}

			// replace requirements
			cat.Requirements = payload.Requirements

			// recompute derived fields
			for i := range cat.Requirements {
				req := &cat.Requirements[i]

				req.EvidenceCount = len(req.Evidence)

				payloadBytes, _ := json.Marshal(req.Evidence)

				req.ETag = hash(
					req.ID +
						req.Status +
						req.Title +
						string(payloadBytes),
				)
			}

			// persist to disk (CRITICAL FIX)
			if err := saveData(); err != nil {
				http.Error(w, "failed to save data", http.StatusInternalServerError)
				return
			}

			json.NewEncoder(w).Encode(cat)
			return
		}
	}

	http.Error(w, "not found", http.StatusNotFound)
}

// -----------------------------
// HEALTH CHECK
// -----------------------------
func health(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}

// -----------------------------
// MAIN
// -----------------------------
func main() {

	if err := loadData(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/health", health)
	http.HandleFunc("/api/requirements", cors(getRequirements))
	http.HandleFunc("/api/categories/", cors(categoryHandler))

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}