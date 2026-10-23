import { useEffect } from "react";
import Parlor from "./components/Parlor/Parlor.jsx";

// body[data-task] is used by styles/base.css for this task's page background.
const TASK_ID = "18";

export default function App() {
  useEffect(() => {
    document.body.dataset.task = TASK_ID;
    return () => { delete document.body.dataset.task; };
  }, []);

  return <Parlor />;
}