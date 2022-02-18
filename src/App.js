import * as tf from "@tensorflow/tfjs"
import * as cocossd from "@tensorflow-models/coco-ssd"
import { useEffect, useState, useRef } from 'react';
import { drawRect } from "./components/utilities";

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [results, setResults] = useState([])
  const [canvasPic, setCanvasPic] = useState(null)

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

  
  if(isLoading) return <h1>Model is loading..</h1>
  return (
    <div className="App">
      <h1>Image Identification</h1>
      <div className="input-holder">
        <input type='file' accept='image/*' capture='camera' className='upload-input' onChange={uploadImage}/>
        <span>OR</span>
        <input type='text' placeholder='Paste Image URL' ref={inputRef} onChange={urlChange} />
        <div className="wrapper">
          <div className="main-content">
            <div className="image">
            
              {imageUrl && <img style={{position: "absolute",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        zindex: 9,
                                        width: 640,
                                        height: 480,}} src={imageUrl} alt='Preview' crossOrigin='anonymous' ref={imageRef} />}
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
            width: 640,
            height: 480,
          }}
        />
              
            </div>
            {results.length > 0 && <div className='result'>
                {<>
                  <ul>
                    {results.map((result, index) => {
                      return <li key={result.class}><span>Name: {result.class.toUpperCase()}</span><span> Confidence Level: {(result.score * 100).toFixed(2)}%</span></li> 
                    })
                    }
                  </ul>
                </> 
                }
              </div>}
          </div>
          <button type="button" className='class="btn btn-primary px-2 me-md-2"' onClick={identify}>Identify Image</button>  
        </div>
      </div>
    </div>
  );
}

export default App;
