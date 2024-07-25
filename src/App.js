import { useState, useEffect } from 'react';
import './App.css';
import { LangaugesList } from './LanguagesList';
// import Translate from './Translate';
import AppService from './service/app-services';
// const {TranslateRequest} = require('@google-cloud/translate/build/src/v2');

function App() {
  const [languagesSelected, setLanguagesSelected] = useState(null);
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    const temp = {};
    LangaugesList.forEach(obj => {
      temp[obj] = true
    })
    setLanguagesSelected(temp);
  }, [])

  useEffect(() => {
    console.log(languagesSelected);
  }, [languagesSelected])


  const listCheckBox = () => {
    if (languagesSelected != null) {
      return LangaugesList.map((obj, index) => {
        return (
          <div className="row" key={index}>
            <label htmlFor={obj}>{obj}</label>
            <input
              type="checkbox"
              id={obj}
              checked={languagesSelected[obj]}
              onChange={(e) => {
                setLanguagesSelected(prevData => {
                  return { ...prevData, [obj]: !languagesSelected[obj] }
                })
              }} />
          </div>
        )
      })
    }

  }

  const renderTranslatedAreas = () => {
    let renderData = [
      <></>
    ];

    Object.keys(translatedTexts).forEach(obj => {
      renderData.push(
        <div className="translated-text">
          <h3>{obj}</h3>
          <pre>{JSON.stringify(translatedTexts[obj], null, 2)}</pre>
        </div>
      )
    }
    )
    // return(
    //   <div>
    //     <pre>
    //       {JSON.stringify(translatedTexts, null, 2)}
    //     </pre>
    //   </div>
    // )
    // console.log(renderData);
    return renderData
  }

  useEffect(() => {
    console.log(translatedTexts);
  }, [translatedTexts])


  const handleSubmit = () => {
    setTranslatedTexts({})
    try {
      // console.log(JSON.parse(jsonText));
      const jsonText = JSON.parse(text);
      const keys = Object.keys(jsonText)
      const textList = [];
      keys.forEach(obj => {
        textList.push(jsonText[obj])
      })

      // const TEST = {
      //   "fr": {
      //     "roof2": "Pour le toit 2.",
      //     "roof1": "Pour toit simple"
      //   },
      //   "pt": {
      //     "roof2": "Para telhado 2.",
      //     "roof1": "Para telhado único"
      //   },
      //   "de": {
      //     "roof2": "Für Dach 2.",
      //     "roof1": "Für Einzeldach"
      //   }
      // }
      // setTranslatedTexts(TEST)

      LangaugesList.forEach(obj => {
        if (languagesSelected[obj]) {
          AppService.translateText(textList, obj).then(response => {
            console.log(obj);
            // console.log(handleResponse(response.data.data.translations, keys));
            let res = response.data.data.translations;
            let temp = {};
            // temp[obj] = {}
            for (let i = 0; i < keys.length; i++) {
              temp[keys[i]] = res[i].translatedText
            }
            setTranslatedTexts(prevData => {
              return { ...prevData, [obj]: temp }
            })
          })
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
      <div className="languagues-list">
        {listCheckBox()}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {renderTranslatedAreas()}
    </div>
  );
}

export default App;