import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AiAnalysisPanel } from "./components/AiAnalysisPanel";
import { ChangeBasketPanel } from "./components/ChangeBasketPanel";
import { ChangeProposalPanel } from "./components/ChangeProposalPanel";
import { CodeTabs } from "./components/CodeTabs";
import { ImpactGraph } from "./components/ImpactGraph";
import { ObjectExplorer } from "./components/ObjectExplorer";
import { TopBar } from "./components/TopBar";
import { useR1Store } from "./store/r1Store";

export default function App() {
  const session = useR1Store((store) => store.session);
  const projects = useR1Store((store) => store.projects);
  const bootstrapSession = useR1Store((store) => store.bootstrapSession);
  const theme = useR1Store((store) => store.theme);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    if (session && projects.length === 0) {
      void bootstrapSession();
    }
  }, [bootstrapSession, projects.length, session]);

  if (!session) {
    return <LoginScreen />;
  }

  const effectiveTheme = presentationMode ? "light" : theme;

  return (
    <div className={`app-root theme-${effectiveTheme} ${presentationMode ? "presentation-mode" : ""}`}>
      <AppShell
        topBar={<TopBar presentationMode={presentationMode} onTogglePresentation={() => setPresentationMode((current) => !current)} />}
        left={<ObjectExplorer />}
        center={<ImpactGraph />}
        right={
          <>
            <AiAnalysisPanel />
            <ChangeProposalPanel />
            <ChangeBasketPanel />
          </>
        }
        bottom={<CodeTabs />}
      />
    </div>
  );
}

function LoginScreen() {
  const login = useR1Store((store) => store.login);
  const loading = useR1Store((store) => store.loading);
  const error = useR1Store((store) => store.error);
  const [email, setEmail] = useState("owner@semantic-prism.local");
  const [password, setPassword] = useState("semantic-prism");

  return (
    <div className="app-root theme-light login-root">
      <form
        className="login-panel"
        onSubmit={(event) => {
          event.preventDefault();
          void login(email, password);
        }}
      >
        <h1>Semantic Prism</h1>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button type="submit" className="primary-action" disabled={loading}>
          Sign in
        </button>
      </form>
    </div>
  );
}
