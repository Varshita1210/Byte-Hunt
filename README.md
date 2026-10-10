# BYTE HUNT — Interactive Technical Puzzle Platform

> "Crack the Clues. Collect the Letters. Unlock the Word."

BYTE HUNT is a collegiate technical puzzle-solving platform inspired by treasure hunts and cryptographic challenges. Teams solve cryptic technical questions, riddles, rebus puzzles, scrambled words, and picture puzzles to collect letters and deduce a secret technical word before time runs out.

---

## 🧭 Concept & Rules

1. **Secret Challenge Assignment**:
   - There are **13 authoritative hidden words** extracted directly from the two official PDF booklets.
   - When a team registers and begins the hunt, the server randomly assigns ONE secret word challenge (e.g. `COMPILER`, `SOFTWARE`, `TOKENIZER`).
   - The target word is **never revealed** to participants during play; they are shown only the required word length and empty letter slots.
2. **Sequential Clue Progression**:
   - Clues associated with the assigned word are randomized in order for each team.
   - Clues must be solved one at a time. The next clue unlocks only after the current clue's correct answer is submitted and validated on the backend.
3. **Letter Collection**:
   - Every correct answer awards its **first letter** to the team's collected letters tray.
   - Clue letters appear in the chronological order in which the team solved the shuffled clues.
4. **Final Word Unlock**:
   - Once all clues are solved, the team arranges their collected letters to deduce and submit the secret technical word.
5. **Server-Authoritative Timer & Scoring**:
   - Timing begins the moment the team clicks Start Hunt and continues across reloads or reconnects.
   - 1 point per solved clue + 2 bonus points for unlocking the secret word.

---

## 📜 The 13 Authoritative Puzzles

| # | Hidden Word | Length | Source | Clue Types Featured |
|---|-------------|--------|--------|---------------------|
| 1 | **SOFTWARE** | 8 | Booklet 1, Round 1 | Picture, Tech Question, Rebus, Scramble, Riddle, Missing Letter |
| 2 | **ENCRYPTION** | 10 | Booklet 1, Round 2 | Picture, Rebus, Tech Question, Riddle, Scramble, Logic |
| 3 | **AUTOMATION** | 10 | Booklet 1, Round 3 | Tech Question, Picture, Riddle, Rebus, Missing Letter, Word |
| 4 | **BLOCKCHAIN** | 10 | Booklet 1, Round 4 | Picture, Tech Question, Rebus, Missing Letter, Scramble, Logic |
| 5 | **ROBOTICS** | 8 | Booklet 1, Round 5 | Riddle, Scramble, Rebus, Tech Question, Picture |
| 6 | **COMPUTING** | 9 | Booklet 1, Round 6 | Picture, Tech Question, Match It, Word Puzzle, Missing Letter, Rebus |
| 7 | **PROTOCOL** | 8 | Booklet 1, Round 7 | Scramble, Picture, Tech Question, Riddle |
| 8 | **TOKENIZER** | 9 | Booklet 2, Round 1 | Word Puzzle, Scramble, Picture, Tech Question, Riddle, Missing Letter |
| 9 | **CLASSIFIER** | 10 | Booklet 2, Round 2 | Picture, Riddle, Tech Question, Word Puzzle, Scramble |
| 10 | **COMPILER** | 8 | Booklet 2, Round 3 | Picture, Tech Question, Riddle, Scramble |
| 11 | **INDEXING** | 8 | Booklet 2, Round 4 | Picture, Rebus, Riddle, Tech Question, Scramble |
| 12 | **ENGINEER** | 8 | Booklet 2, Round 5 | Picture, Rebus, Tech Question, Logic, Riddle |
| 13 | **ALGORITHM** | 9 | Booklet 2, Round 6 | Tech Question, Picture, Word Puzzle, Riddle, Missing Letter |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default administrator password: `admin_bytehunt_2026`

### 3. Running Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 🔒 Security Architecture
- **Private Answer Keys**: Validation occurs exclusively on the backend (`/api/game/answer` and `/api/game/final-answer`). The frontend never receives target words, future clues, or answer keys.
- **Session Authentication**: Teams use a cryptographic `x-session-token` to prevent unauthorized snooping or session hijacking.
- **Anti-Cheat Persistence**: Server timestamps are the single source of truth for duration calculations; browser manipulation cannot tamper with time.
