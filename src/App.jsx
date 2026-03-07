import { useMemo, useState } from "react";
import Desktop from "./components/Desktop.jsx";
import Taskbar from "./components/Taskbar.jsx";
import XWindow from "./components/XWindow.jsx";
import { XDesktop } from "./model/XDesktop.js";
import "./css/style.css";
import "./css/xwindow.css";

export default function App() {
  const desktop = useMemo(() => new XDesktop(), []);
  const [, forceUpdate] = useState(0);

  function refresh() {
    desktop.removeClosedWindows();
    forceUpdate(prev => prev + 1);
  }

  return (
    <div className="app">
      <main className="desktop">
        <Desktop desktop={desktop} refresh={refresh} />

        {desktop.windows.map(win => (
          <XWindow
            key={win.id}
            win={win}
            desktop={desktop}
            refresh={refresh}
          />
        ))}
      </main>

      <footer className="taskbar">
        <Taskbar desktop={desktop} />
      </footer>
    </div>
  );
}