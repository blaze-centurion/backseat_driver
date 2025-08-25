# **Backseat Driver**

Backseat Driver is a voice-controlled application designed to assist drivers, providing a hands-free experience.

## **Description**

This application acts as a virtual assistant for drivers, allowing them to get information and perform actions using voice commands, ensuring they can keep their hands on the wheel and eyes on the road. It leverages generative AI to understand and respond to user queries in real-time.

## **How It Works**

The application operates through a simple, voice-driven interface:

1. **Voice Input:** The user activates the microphone and speaks a command or question.  
2. **Speech-to-Text:** The browser's built-in speech recognition capabilities convert the user's voice into text.  
3. **AI Processing:** The transcribed text is sent to the Google Gemini AI model.  
4. **AI Response:** The Gemini model processes the query and generates a relevant, natural language response.  
5. **Display Output:** The application receives the response from the AI and displays it on the user interface for the driver to see. It can also use text-to-speech to read the response aloud.

This entire process happens in near real-time, providing a seamless conversational experience for the driver.

## **Features**

* **Voice-activated commands:** Control the application entirely through voice.  
* **Real-time responses:** Get immediate feedback and information.  
* **Modern User Interface:** A clean and intuitive interface built with React and Tailwind CSS.

## **Technologies Used**

This project is built with a modern tech stack:

* **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)  
* **Build Tool:** [Vite](https://vitejs.dev/)  
* **AI:** [Google Gemini AI](https://ai.google.dev/)  
* **Linting/Formatting:** [ESLint](https://eslint.org/)

## **Setup and Installation**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

You need to have [Node.js](https://www.google.com/search?q=https://nodejs.org/) and [npm](https://www.npmjs.com/) (or yarn) installed on your machine.

### **Installation**

1. Clone the repository:  
   git clone https://github.com/your\_username/backseat-driver.git

2. Navigate to the project directory:  
   cd backseat-driver

3. Install NPM packages:  
   npm install

4. Create a .env file in the root of the project and add your Google Gemini API key:  
   VITE\_GEMINI\_API\_KEY=YOUR\_API\_KEY

## **Usage**

To run the application in development mode:

npm run dev

This will start the development server, and you can view the application in your browser at http://localhost:5173 (or another port if 5173 is in use).

To build the application for production:

npm run build

This will create a dist folder with the optimized production build.

To preview the production build locally:

npm run preview  
