import { useEffect, useRef } from "react";
import styles from "./App.module.scss";
import { useState } from "react";
import { Button, Loader } from "monday-ui-react-core";
import 'monday-ui-react-core'


const data = { entities: {} };
const baseURL = "http://localhost:3002";
function App() {
  const [mfInterface, setMfInterface] = useState();
  const [assetsManifest, setAssetsManifest] = useState();
  const ref = useRef(null);

  const loadAssetsManifest = async () => {
    const response = await fetch(`${baseURL}/asset-manifest.json`);
    const json = await response.json();
    setAssetsManifest(json);
  };

  useEffect(() => {
    loadAssetsManifest();
  }, []);

  useEffect(() => {
    if (!assetsManifest) return;

    const script = document.createElement("script");

    const src = assetsManifest?.entrypoints?.find((entrypoint) =>
      entrypoint.endsWith(".js")
    );
    const [mfUuid] = src.split(".");

    script.id = "MF-SCRIPT";
    script.src = `${baseURL}/${src}`;
    script.onload = () => {
      setMfInterface(window[mfUuid]);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [assetsManifest]);

  if (mfInterface && ref.current) {
    mfInterface.render(ref.current, {
      data,
    });
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        this is not MF
        <Button>click here</Button>
      </div>
      <div className={styles.mfWrapper} ref={ref}>
        <Loader size={Loader.sizes.LARGE} />
      </div>
    </div>
  );
}

export default App;
