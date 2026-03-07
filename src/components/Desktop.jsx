import XView from "./XView.jsx";

export default function Desktop({ desktop }) {
    function handleActivateDesktop() {
        desktop.deactivateAllWindows();
    }

    return (
        <XView
            view={desktop.view}
            desktop={desktop}
            onActivate={handleActivateDesktop}
        />
    );
}
