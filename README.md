# 🚀 Cheetah Type – Typing Speed Test App

A modern typing speed test application built using **React, TypeScript, TailwindCSS, and Axios**.

This project provides a smooth and interactive typing experience with real-time feedback and dynamic text generation.

---

## ✨ Features

* ⌨️ Real-time typing interface (no visible input box)
* 🎯 Character-by-character accuracy highlighting
* ⚡ Live WPM (Words Per Minute) calculation
* ❌ Mistake tracking
* ⏱️ Timer-based typing test
* 🔁 Continuous text generation (infinite typing flow)
* 🌐 Dynamic paragraphs using API
* 🟡 Blinking cursor for better UX
* 🎨 Clean and modern UI

---

## 🧠 How It Works

1. The app fetches a random quote from an API
2. User starts typing → timer begins
3. Each character is compared in real time

   * Correct → Green
   * Incorrect → Red
4. As the user approaches the end, new text is appended
5. Typing continues until the timer ends
6. Final stats are displayed

---

## 🛠️ Tech Stack

* React (Vite)
* TypeScript
* TailwindCSS
* Axios
* Quotable API

---

## 📦 Installation

```bash id="install-1"
git clone https://github.com/your-username/cheetah-type.git
cd cheetah-type
npm install
npm run dev
```

---

## 📁 Project Structure

```text id="structure-1"
src/
 ├── App.tsx       # Core typing logic
 ├── main.tsx      # Entry point
 ├── index.css     # Tailwind styles
```

---

## 📊 Core Logic

### WPM (Words Per Minute)

```text id="wpm-1"
WPM = (Characters Typed / 5) / Time (in minutes)
```

---

### Mistakes

```text id="mistake-1"
Mistakes = Number of incorrect characters typed
```

---

## 🚀 Future Improvements

* 🔤 Word-based typing system
* 📈 Accuracy percentage
* 🔁 Restart test functionality
* ⏲️ Multiple timer options
* 🎯 Improved UI and animations

---

## 👨‍💻 Author

Built by Tushar
