import { useEffect, useMemo, useState } from "react";
import Desktop from "./components/Desktop.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import StartMenu from "./components/StartMenu.jsx";
import Taskbar from "./components/Taskbar.jsx";
import XWindow from "./components/XWindow.jsx";
import { XDesktop } from "./model/XDesktop.js";
import { useXStore } from "./hooks/useXStore.js";
import XContextMenu from "./components/XContextMenu.jsx";
import "./css/style.css";
import "./css/xwindow.css";

export default function App() {
  const desktop = useMemo(() => new XDesktop(), []);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(true);

  useXStore(desktop.store);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "Escape")
        return;

      let changed = false;

      if (desktop.contextMenu.visible) {
        desktop.contextMenu.close();
        changed = true;
      }

      if (startMenuOpen)
        setStartMenuOpen(false);

      if (splashOpen)
        setSplashOpen(false);

      if (changed)
        desktop.notify();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [desktop, startMenuOpen, splashOpen]);

  function closeTransientUi() {
    let changed = false;

    if (desktop.contextMenu.visible) {
      desktop.contextMenu.close();
      changed = true;
    }

    if (startMenuOpen)
      setStartMenuOpen(false);

    if (changed)
      desktop.notify();
  }

  function handleDesktopMouseDown() {
    if (splashOpen)
      return;

    closeTransientUi();
  }

  function handleToggleStartMenu() {
    if (splashOpen)
      return;

    if (desktop.contextMenu.visible) {
      desktop.contextMenu.close();
      desktop.notify();
    }

    setStartMenuOpen(prev => !prev);
  }

  function handleCloseStartMenu() {
    setStartMenuOpen(false);
  }

  function handleCloseSplash() {
    setSplashOpen(false);
  }

  return (
    <div className="app">
      <main className="desktop" onMouseDown={handleDesktopMouseDown}>
        <Desktop desktop={desktop} />

        {desktop.windows
          .filter(win => !win.minimized)
          .map(win => (
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

        <StartMenu
          open={startMenuOpen}
          onClose={handleCloseStartMenu}
        />

        <SplashScreen
          open={splashOpen}
          onClose={handleCloseSplash}
        />
      </main>

      <footer className="taskbar">
        <Taskbar
          desktop={desktop}
          startMenuOpen={startMenuOpen}
          onToggleStartMenu={handleToggleStartMenu}
        />
      </footer>
    </div>
  );
}
