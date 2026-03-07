import { useMemo } from "react";
import Desktop from "./components/Desktop.jsx";
import Taskbar from "./components/Taskbar.jsx";
import XWindow from "./components/XWindow.jsx";
import { XDesktop } from "./model/XDesktop.js";
import { useXStore } from "./hooks/useXStore.js";
import "./css/style.css";
import "./css/xwindow.css";

export default function App() {
  const desktop = useMemo(() => new XDesktop(), []);

  useXStore(desktop.store);

  return (
    <div className="app">
      <main className="desktop">
        <Desktop desktop={desktop} />

        {desktop.windows.filter(win => !win.minimized).map(win => (
          <XWindow
            key={win.id}
            win={win}
            desktop={desktop}
          />
        ))}
      </main>

      <footer className="taskbar">
        <Taskbar desktop={desktop} />
      </footer>
    </div>
  );
}
