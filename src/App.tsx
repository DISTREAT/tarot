import { useState } from "react";
import { exit } from "@tauri-apps/api/process";
import Draggable from "react-draggable";
import Modal from "react-modal";
import cards from "./cards.json";

interface CardProps {
  name: string;
  meaning: string;
  fileName: string;
  reversals: boolean;
}

function Card(props: CardProps) {
  const [zoom, setZoom] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reversed, _] = useState(props.reversals ? Math.random() < 0.2 : false);

  return (
    <>
      <Draggable bounds="#border">
        <div
          className={`h-full w-fit relative ${revealed ? "hover:z-40" : ""}`}
        >
          <img
            src={`tarot/${props.fileName}`}
            className={`h-full ${reversed ? "rotate-180" : "rotate-0"}`}
            draggable={false}
            onDoubleClick={() => setZoom(true)}
          />
          <img
            src="tarot/CardBacks.png"
            draggable={false}
            style={{ userSelect: "none" }}
            className={`bg-black absolute top-0 w-full h-full border-2 ${
              revealed ? "hidden" : ""
            }`}
            onClick={() => setRevealed(true)}
          />
        </div>
      </Draggable>
      <Modal
        isOpen={zoom}
        onRequestClose={() => setZoom(false)}
        style={{
          overlay: { background: "rgba(0, 0, 0, 0.4)" },
          content: {
            padding: "0px",
            border: "0px",
            background: "transparent",
            width: "400px",
            height: "75%",
            top: "-10%",
            margin: "auto",
          },
        }}
      >
        <div className="flex flex-col h-full w-full justify-top">
          <div className="bg-amber-100 rounded-t-xl w-full flex place-content-center">
            <img
              src={`tarot/${props.fileName}`}
              className={`pt-6 px-6 ${
                reversed ? "rotate-180 pb-6" : "rotate-0"
              }`}
              draggable={false}
              onClick={() => setZoom(true)}
            />
          </div>
          <div className="px-4 py-6 space-y-1 bg-amber-100 rounded-b-xl">
            <h2 className="text-3xl text-center">{props.name}</h2>
            <p className="text-md font-medium text-center">{props.meaning}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}

function App() {
  const deck = cards.sort(() => Math.random() - 0.5);
  const [reversals, setReversals] = useState(
    JSON.parse(localStorage.getItem("reversals") || "false"),
  );

  async function quitApplication() {
    await exit(0);
  }

  function refreshPage() {
    window.location.reload();
  }

  function changeReversalsCheckbox() {
    localStorage.setItem("reversals", JSON.stringify(!reversals));
    setReversals(!reversals);
    refreshPage();
  }

  return (
    <div id="border" className="flex flex-col h-screen w-screen">
      <div className="flex flex-row px-3 space-x-2 bg-black h-7 w-full justify-between">
        <div className="space-x-4">
          <button
            className="text-white text-sm"
            onDoubleClick={quitApplication}
          >
            Quit
          </button>
          <button className="text-white text-sm" onDoubleClick={refreshPage}>
            Restart
          </button>
        </div>
        <div className="space-x-2">
          <label htmlFor="reversals" className="text-white text-sm">
            Reversals
          </label>
          <input
            type="checkbox"
            checked={reversals}
            onDoubleClick={changeReversalsCheckbox}
          />
        </div>
      </div>
      <div className="h-5/6 background"></div>
      <div className="h-1/6 bg-gradient-to-b from-gray-900 to-black flex flex-row p-2 align-center -space-x-14">
        {deck.map((card) => {
          return (
            <Card
              name={card.name}
              meaning={card.meaning}
              fileName={card.file}
              reversals={reversals}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
