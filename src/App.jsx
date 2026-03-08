import { useEffect, useMemo } from "react";
import Desktop from "./components/Desktop.jsx";
import Taskbar from "./components/Taskbar.jsx";
import XWindow from "./components/XWindow.jsx";
import { XDesktop } from "./model/XDesktop.js";
import { useXStore } from "./hooks/useXStore.js";
import XContextMenu from "./components/XContextMenu.jsx";
import "./css/style.css";
import "./css/xwindow.css";

export default function App() {
  const desktop = useMemo(() => new XDesktop(), []);

  useXStore(desktop.store);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "Escape")
        return;

      if (!desktop.contextMenu.visible)
        return;

      desktop.contextMenu.close();
      desktop.notify();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [desktop]);

  function handleDesktopMouseDown() {
    if (desktop.contextMenu.visible) {
      desktop.contextMenu.close();
      desktop.notify();
    }
  }

  return (
    <div className="app">
      <main className="desktop" onMouseDown={handleDesktopMouseDown}>
        <Desktop desktop={desktop} />

        {desktop.windows.filter(win => !win.minimized).map(win => (
          <XWindow
            key={win.id}
            win={win}
            desktop={desktop}
          />
        ))}

        <XContextMenu
          menu={desktop.contextMenu}
          desktop={desktop}
        />
      </main>

      <footer className="taskbar">
        <Taskbar desktop={desktop} />
      </footer>
    </div>
  );
}
