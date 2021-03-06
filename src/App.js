import * as tf from "@tensorflow/tfjs"
import * as cocossd from "@tensorflow-models/coco-ssd"
import { useEffect, useState, useRef } from 'react';
import { drawRect } from "./components/utilities";
import LoadingPage from "./components/LoadingPage";

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [results, setResults] = useState([])
  const [color, setColor] = useState("#123abc")

  const imageRef = useRef()
  const inputRef = useRef()
  const canvasRef = useRef(null)

  const loadModel = async () => {
    setIsLoading(true)
    try {
      const model = await cocossd.load()
      setModel(model)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

  }

  const urlChange = (e) => {
    setImageUrl(e.target.value)
    setResults([])
  }

  const uploadImage = (e) => {
    const {files} = e.target
    if(files.length === 0) return setImageUrl(null)
    if(files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageUrl(url)
    }
  }

  const identify = async () => {
    inputRef.current.value = ''
    canvasRef.current.width = imageRef.current.width
    canvasRef.current.height = imageRef.current.height
    const results = await model.detect(imageRef.current)
    setResults(results)
    console.log(results)
    const ctx = canvasRef.current.getContext("2d")
    drawRect(results, ctx)
  }

  useEffect(() => {
    loadModel()
  }, [])

  
  if(isLoading) return <LoadingPage isLoading={isLoading} color={color} />
  return (
    <div className="App">
      <h1>Object Detection</h1>
      <div className="input-holder">
        <input type='file' accept='image/*' capture='camera' className='upload-input' onChange={uploadImage}/>
        <span>OR</span>
        <input type='text' placeholder='Paste Image URL' ref={inputRef} onChange={urlChange} />
        <div className="wrapper">
          <div className="main-content">
              {imageUrl && <button type="button" className="btn btn-primary px-2 me-md-2 my-4" onClick={identify}>Identify Objects</button>  }
              {results.length > 0 && <div className='result'>
                  {<>
                    <ul>
                      {results.map((result, index) => {
                        return <li><span>Detected: {result.class.toUpperCase()}</span><span> Confidence Level: {(result.score * 100).toFixed(2)}%</span></li> 
                      })
                      }
                    </ul>
                  </> 
                  }
                </div>}
            <div className="image">
            
              {imageUrl && <img style={{position: "absolute",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        zindex: 9,
                                        width: 560,
                                        height: 500,}} src={imageUrl} alt='Preview' crossOrigin='anonymous' ref={imageRef} />}
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 8,
                  width: 560,
                  height: 500,
                }}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
