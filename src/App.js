import { ReactSortable } from "react-sortablejs";

import "./App.scss";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  FaPlus,
  FaTimes,
  FaDivide,
  FaMinus,
  FaPercentage,
} from "react-icons/fa";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { VscGroupByRefType, VscUngroupByRefType } from "react-icons/vsc";

function App() {
  const [math, setMath] = useLocalStorage("math", [
    {
      id: 1,
      label: "Label 1",
      method: "Multiplication",
      cascade: false,
      value: 100,
      n1: 100,
      n2: 20,
    },
    {
      id: 2,
      label: "Label 2",
      method: "Division",
      cascade: false,
      value: 100,
      n1: 100,
      n2: 20,
    },
  ]);

  const methods = [
    "Multiplication",
    "Division",
    "Addition",
    "Subtraction",
    "Percentage Between",
    "Percentage Of",
    "Percentage Increase",
  ];

  // useEffect(() => {
  //   console.log("Math");
  //   return () => {};
  // }, [setMath]);

  function appNewRow() {
    let count = math.length + 1;

    setMath([
      ...math,
      {
        id: count,
        label: "Label",
        method: "Addition",
        value: 0,
        n1: 0,
        n2: 0,
      },
    ]);
  }

  function appRemoveRow(index) {
    let newArr = [...math];
    newArr.splice(index, 1);
    setMath(newArr);
  }

  function sortableUpdate(item) {
    let newArr = [...math];

    let currentObj = newArr[item.oldIndex];
    newArr.splice(item.oldIndex, 1);
    newArr.splice(item.newIndex, 0, currentObj);

    if (newArr[item.newIndex - 1]) {
      newArr[item.newIndex].n1 = newArr[item.newIndex - 1].value;
    }

    setMath(newArr);
    doMath(null, newArr);
  }

  function appSetCascade(index) {
    let newArr = [...math];
    if (index) {
      newArr[index].n1 = newArr[index - 1].value;
      newArr[index].cascade = !newArr[index].cascade;
    }
    setMath(newArr);
    doMath(null, newArr);
  }

  const appChangeMethod = (index) => (e) => {
    let newArr = [...math];
    newArr[index].method = e.target.value;
    setMath(newArr);
    doMath(index);
  };

  const n1 = (index) => (e) => {
    let newArr = [...math];

    if (!newArr[index].cascade) {
      newArr[index].n1 = Number(e.target.value);
    }

    if (newArr[index].cascade) {
      newArr[index].n1 = newArr[index - 1].value;
    }

    setMath(newArr);
    doMath(index);
  };

  const label = (index) => (e) => {
    let newArr = [...math];
    newArr[index].label = e.target.value;
    setMath(newArr);
  };

  const n2 = (index) => (e) => {
    let newArr = [...math];
    newArr[index].n2 = Number(e.target.value);
    setMath(newArr);
    doMath(index);
  };

  const doMath = (index = null, newArrx = null) => {
    let value = 0;
    let newArr = [...math];

    if (newArrx) {
      newArr = newArrx;
    } else {
      newArr = [...math];
    }

    function calculate(n1, n2, method) {
      if (method === "Multiplication") {
        value = Number(n1) * Number(n2);
      }

      if (method === "Division") {
        value = Number(n1) / Number(n2);
      }

      if (method === "Addition") {
        value = Number(n1) + Number(n2);
      }

      if (method === "Percentage Between") {
        value = (Number(n1) / Number(n2)) * 100;
      }

      if (method === "Percentage Of") {
        value = (Number(n1) / 100) * Number(n2);
      }

      if (method === "Percentage Increase") {
        value = (Number(n1) / Number(n2)) * 100;
      }

      if (method === "Subtraction") {
        value = Number(n1) - Number(n2);
      }

      return value;
    }

    if (index) {
      newArr[index].value = Number(value);
    }

    newArr.every((item, index) => {
      if (item.cascade) {
        if (newArr[index - 1]) {
          item.n1 = newArr[index - 1].value;
        }
        item.value = calculate(item.n1, item.n2, item.method);
        return item;
      } else {
        item.value = calculate(item.n1, item.n2, item.method);
        return item;
      }
    });

    setMath(newArr);
  };

  return (
    <div className="App">
      <div className="Navigation"></div>
      <div className="Pane">
        <div className="CascadingMath">
          <ReactSortable
            list={math}
            setList={(newState) => setMath(newState)}
            onUpdate={(e) => sortableUpdate(e)}
          >
            {math &&
              math.map((ma, i) => {
                return (
                  <div
                    key={ma.id}
                    className={`
                    ${
                      ma.cascade
                        ? "math-method cascade-on"
                        : "math-method  cascade-off"
                    } ${
                      math[i + 1] && math[i + 1].cascade
                        ? "next-cascade-on"
                        : "next-cascade-off"
                    }`}
                  >
                    <input
                      type="text"
                      className="label"
                      value={ma.label}
                      onChange={label(i)}
                    />
                    <div className="calculation-label">
                      <label>Calculation</label>
                      <select value={ma.method} onChange={appChangeMethod(i)}>
                        {methods.map((method, i) => {
                          return (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="number-group">
                      <input
                        type="number"
                        className="n1"
                        value={ma.n1}
                        onChange={n1(i)}
                      />
                      {/* <button onClick={() => appDefaultValue(i)}>Default</button> */}

                      <div className="number-symbol">
                        {ma.method === "Addition" && <FaPlus />}
                        {ma.method === "Multiplication" && <FaTimes />}

                        {ma.method === "Division" && <FaDivide />}
                        {ma.method === "Subtraction" && <FaMinus />}

                        {ma.method === "Percentage Between" && <FaPercentage />}
                        {ma.method === "Percentage Of" && <FaPercentage />}
                        {ma.method === "Percentage Increase" && (
                          <FaPercentage />
                        )}
                      </div>
                      <input
                        type="number"
                        className="n2"
                        value={ma.n2}
                        onChange={n2(i)}
                      />
                    </div>
                    <div
                      onClick={() => appSetCascade(i)}
                      className="app-cascade-setting"
                    >
                      {ma.cascade ? (
                        <VscGroupByRefType />
                      ) : (
                        <VscUngroupByRefType />
                      )}
                    </div>

                    {ma.value}

                    <div
                      className="app-remove-row"
                      onClick={() => appRemoveRow(i)}
                    >
                      <AiOutlineCloseSquare />
                    </div>
                  </div>
                );
              })}
          </ReactSortable>

          {math.reduce((accumulator, current) => {
            // if (!prev.value) {
            //   return prev;
            // }

            return accumulator + current.value;
          }, 0)}
          <button className="app-new-row" onClick={() => appNewRow()}>
            Add Calculation
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
