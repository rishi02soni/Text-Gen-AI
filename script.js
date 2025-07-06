// DOM Elements
const userInput = document.getElementById("userInput")
const generateBtn = document.getElementById("generateBtn")
const clearBtn = document.getElementById("clearBtn")
const copyBtn = document.getElementById("copyBtn")
const output = document.getElementById("output")

// State
let isGenerating = false

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Text Generator App initialized")

  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add input validation
  userInput.addEventListener("input", function () {
    const hasContent = this.value.trim().length > 0
    generateBtn.disabled = !hasContent || isGenerating

    if (hasContent) {
      generateBtn.classList.add("ready")
    } else {
      generateBtn.classList.remove("ready")
    }
  })

  // Add keyboard shortcuts
  userInput.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault()
      generateText()
    }
  })
})

// Main text generation function
async function generateText() {
  const inputText = userInput.value.trim()

  if (!inputText) {
    showNotification("Please enter some text to generate content.", "warning")
    return
  }

  if (isGenerating) {
    return
  }

  setGeneratingState(true)

  try {
    // Show loading state
    showLoadingState()

    // Make API call
    // Make API call
  const response = await fetch(`http://127.0.0.1:8000/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: inputText,
      max_length: 500,  // ✅ match with FastAPI
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  if (data.generated_text) {
    displayGeneratedText(data.generated_text)
    showNotification("Text generated successfully!", "success")
  } else {
    throw new Error(data.error || "Failed to generate text")
  }

  } catch (error) {
    console.error("Error generating text:", error)
    showError(error.message)
    showNotification("Failed to generate text. Please try again.", "error")
  } finally {
    setGeneratingState(false)
  }
}

// Set generating state
function setGeneratingState(generating) {
  isGenerating = generating
  generateBtn.disabled = generating || !userInput.value.trim()

  const btnText = generateBtn.querySelector(".btn-text")
  const btnLoader = generateBtn.querySelector(".btn-loader")

  if (generating) {
    btnText.style.display = "none"
    btnLoader.style.display = "flex"
    generateBtn.classList.add("generating")
  } else {
    btnText.style.display = "inline"
    btnLoader.style.display = "none"
    generateBtn.classList.remove("generating")
  }
}

// Show loading state in output
function showLoadingState() {
  output.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <p>Generating your content...</p>
            <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `
  output.classList.remove("has-content")
}

// Display generated text
function displayGeneratedText(text) {
  output.innerHTML = ""
  output.textContent = text
  output.classList.add("has-content")
  copyBtn.style.display = "inline-block"

  // Add typing animation effect
  animateText(output, text)
}

// Animate text appearance
function animateText(element, text) {
  element.textContent = ""
  let i = 0
  const speed = 20 // milliseconds per character

  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(typeWriter, speed)
    }
  }

  typeWriter()
}

// Show error in output
function showError(errorMessage) {
  output.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Generation Failed</h4>
            <p>${errorMessage}</p>
            <button class="btn-retry" onclick="generateText()">Try Again</button>
        </div>
    `
  output.classList.remove("has-content")
  copyBtn.style.display = "none"
}

// Clear all content
function clearAll() {
  userInput.value = ""
  output.innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon">✨</div>
            <p>Your generated text will appear here...</p>
        </div>
    `
  output.classList.remove("has-content")
  copyBtn.style.display = "none"
  generateBtn.disabled = true
  generateBtn.classList.remove("ready")

  showNotification("Content cleared successfully!", "info")
}

// Copy to clipboard
async function copyToClipboard() {
  const textToCopy = output.textContent

  if (!textToCopy || textToCopy.includes("Your generated text will appear here")) {
    showNotification("No content to copy!", "warning")
    return
  }

  try {
    await navigator.clipboard.writeText(textToCopy)

    // Visual feedback
    const originalText = copyBtn.textContent
    copyBtn.textContent = "✅ Copied!"
    copyBtn.style.background = "#10b981"

    setTimeout(() => {
      copyBtn.textContent = originalText
      copyBtn.style.background = "#10b981"
    }, 2000)

    showNotification("Text copied to clipboard!", "success")
  } catch (error) {
    console.error("Failed to copy text:", error)
    showNotification("Failed to copy text. Please select and copy manually.", "error")
  }
}

// Scroll to generator section
function scrollToGenerator() {
  const generatorSection = document.getElementById("generator")
  generatorSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })

  // Focus on input after scrolling
  setTimeout(() => {
    userInput.focus()
  }, 1000)
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 300)
    }
  }, 5000)
}

// Get notification icon
function getNotificationIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }
  return icons[type] || icons.info
}

// Get notification color
function getNotificationColor(type) {
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  }
  return colors[type] || colors.info
}

// Add CSS for loading animation
const style = document.createElement("style")
style.textContent = `
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #6b7280;
    }

    .loading-spinner {
        margin-bottom: 1rem;
    }

    .loading-dots {
        margin-top: 0.5rem;
    }

    .loading-dots span {
        animation: loading-dots 1.4s infinite ease-in-out both;
        font-size: 1.5rem;
        color: #6366f1;
    }

    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes loading-dots {
        0%, 80%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }

    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        text-align: center;
        color: #ef4444;
    }

    .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .error-state h4 {
        margin-bottom: 0.5rem;
        color: #374151;
    }

    .error-state p {
        margin-bottom: 1.5rem;
        color: #6b7280;
    }

    .btn-retry {
        padding: 0.75rem 1.5rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .btn-retry:hover {
        background: #dc2626;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }

    .btn-generate.ready {
        background: linear-gradient(135deg, #10b981, #059669);
    }

    .btn-generate.generating {
        background: linear-gradient(135deg, #6b7280, #4b5563);
    }

    .btn-loader {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
document.head.appendChild(style)
