# Future Furniture

Future Furniture is an interactive 3D furniture visualization application that allows users to experience furniture in
both 2D and 3D views before purchasing. Users can browse a catalog of furniture items, view them in different room
settings, and customize various properties of both the furniture and rooms.

## Overview

The application provides an immersive experience for users to:

- Browse a catalog of furniture items
- View furniture in 3D with realistic lighting and materials
- Place furniture in different room settings
- Customize furniture and room properties (colors, dimensions, etc.)
- Switch between 2D and 3D views for different perspectives

## Tech Stack

| Category           | Technologies                                  |
| ------------------ | --------------------------------------------- |
| Frontend Framework | React 19                                      |
| Routing            | React Router DOM 7                            |
| 3D Rendering       | Three.js, React Three Fiber, React Three Drei |
| Styling            | TailwindCSS 4                                 |
| Build Tool         | Vite 6                                        |
| Language           | TypeScript                                    |
| Code Quality       | ESLint, Prettier, Husky                       |

## Project Structure

```
future-furniture/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Layout components (Header, SideNav, etc.)
│   │   └── ...         # Other components
│   ├── data/           # Data management
│   │   ├── furniture.ts # Furniture data
│   │   └── rooms.ts    # Room data
│   ├── models/         # Data models
│   │   ├── furniture/  # Furniture models
│   │   ├── rooms/      # Room models
│   │   └── property.ts # Property model
│   ├── pages/          # Application pages
│   │   ├── Catalog.tsx # Furniture catalog page
│   │   ├── Landing.tsx # Home page
│   │   └── Viewer.tsx  # 3D viewer page
│   ├── App.tsx         # Main application component
│   ├── ThreeScene.tsx  # 3D scene component
│   └── main.tsx        # Application entry point
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/future-furniture.git
   cd future-furniture
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Key Functionalities

### 3D Furniture Visualization

- Real-time 3D rendering of furniture items
- Realistic lighting and materials
- Camera controls (orbit, pan, zoom)

### Room Settings

- Multiple room types to place furniture in
- Customizable room properties (wall color, floor material, etc.)

### Furniture Customization

- Adjust furniture properties (color, size, etc.)
- See changes in real-time

### View Modes

- 3D view for an immersive experience
- 2D view for floor planning
