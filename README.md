## Getting Started

To start using this application, follow the steps below:

1. **Clone or Download the Repository:**

   - Clone the repository using Git or download it as a ZIP file and extract it to your local machine.

2. **Install Dependencies:**

   - Open your terminal or command prompt.
   - Navigate to the project directory.
   - Run the following command to install all the required packages:
     ```
     npm install
     ```

3. **Run the Application:**

   - After installing the dependencies, run the following command to start the development server:
     ```
     npm run dev
     ```

4. **Configuration:**
   - Set the Axios base URL to match your server URL:
     ```javascript
     const apiClient = axios.create({
       baseURL: "http://localhost:8000",
     });
     ```
   - Set the Socket.io URL to match your server URL:
     ```javascript
     const socket = io("http://localhost:8000");
     ```

## Usage

Once the application is up and running, you'll find the following options for managing tasks and categories:

1. **Task Management:**

   - Create, update, and delete tasks.
   - Assign tasks to different categories.
   - Update task progress.
   - Receive notifications for task updates.

2. **Category Management:**

   - Create, update, and delete categories for organizing tasks.

3. **Task Assignment:**

   - Assign tasks to specific categories for better organization.

4. **List Creation:**

   - Create different task lists for better task management.

5. **Assigned Task Management:**
   - Manage tasks that have been assigned to you.
   - Update task progress.
   - Send notifications to the task creator upon updates.

Enjoy managing your tasks efficiently with this application!
