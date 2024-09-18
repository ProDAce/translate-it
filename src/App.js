import { useState, useEffect } from 'react';
import './App.css';
import { LangaugesList } from './LanguagesList';
// import Translate from './Translate';
import AppService from './service/app-services';
// const {TranslateRequest} = require('@google-cloud/translate/build/src/v2');

function App() {
  const [languagesSelected, setLanguagesSelected] = useState(null);
  const [translatedTexts, setTranslatedTexts] = useState(
    {
      // "it": {
      //   "name": "come ti chiami?"
      // },
      // "de": {
      //   "name": "wie heißt du?"
      // },
      // "pt": {
      //   "name": "qual o seu nome?"
      // },
      // "fr": {
      //   "name": "quel est ton nom ?"
      // },
      // "es": {
      //   "name": "¿cómo te llamas?"
      // }
    }
  );
  const [text, setText] = useState("");

  useEffect(() => {
    const temp = {};
    LangaugesList.forEach(obj => {
      temp[obj.id] = true
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
            <label htmlFor={"ll_"+obj.id}>{obj.name + "(" + obj.id + ")"}</label>
            <input
              type="checkbox"
              id={"ll_"+obj.id}
              checked={languagesSelected[obj.id]}
              onChange={(e) => {
                setLanguagesSelected(prevData => {
                  return { ...prevData, [obj.id]: !languagesSelected[obj.id] }
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
      const t = LangaugesList.find(x => x.id === obj);
      renderData.push(
        <div className="translated-text" key={obj}>
          <h3>{t.name + "(" + t.id + ")"}</h3>
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

      LangaugesList.forEach(obj => {
        if (languagesSelected[obj.id]) {
          AppService.translateText(textList, obj.id).then(response => {
            console.log(obj);
            // console.log(handleResponse(response.data.data.translations, keys));
            let res = response.data.data.translations;
            let temp = {};
            // temp[obj] = {}
            for (let i = 0; i < keys.length; i++) {
              temp[keys[i]] = res[i].translatedText
            }
            setTranslatedTexts(prevData => {
              return { ...prevData, [obj.id]: temp }
            })
          })
        }
      })
    } catch (error) {
      console.log(error);
      alert("Not valid JSON")
    }
  }

  const placeholder = 'Input valid JSON text to generate the values of each keys for the selected languages.\n\nExample:-\n\n{\n"name": "What is your name?"\n}'

  return (
    <div className="App">
      <h1>Translate-It</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder={placeholder}></textarea>
      <div className="languagues-list">
        {listCheckBox()}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {renderTranslatedAreas()}
    </div>
  );
}

export default App;