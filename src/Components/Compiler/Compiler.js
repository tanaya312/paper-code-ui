import React, { Component } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";


import "./Compiler.css";
export default class Compiler extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem('input')||``,
      output: ``,
      language_id:localStorage.getItem('language_Id')|| 54,
      language_compiler: `python`,
      user_input: ``,
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }
 

  onChange(newValue)
  {
    this.setState({ input: newValue });
    localStorage.setItem('input', newValue)
  }
  userInput = (event) => {
    event.preventDefault();
    this.setState({ user_input: event.target.value });
  };

  language = (event) => {
   
    event.preventDefault();
   
    this.setState({ language_id: event.target.value });
    localStorage.setItem('language_Id',event.target.value);
    console.log(event.target.value);
    console.log(this.state.language_id);
    console.log(this.state.language_compiler);

    if(event.target.value === 50)
    {
      this.setState({language_compiler: "c_cpp"})
    }
    else if(event.target.value === 54)
    {
      this.setState({language_compiler: "c_cpp"})
    }
    else if(event.target.value === 62)
    {
      this.setState({language_compiler: "java"})
    }
    else if(event.target.value === 70)
    {
      this.setState({language_compiler: "python"})
    }

    console.log(this.state.language_compiler);
   
  };

  submit = async (e) => {
    e.preventDefault();

    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "83ee3303b5mshe3c91dd9c4ca2edp189625jsn6bf5577eeeea", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: this.state.input,
          stdin: this.state.user_input,
          language_id: this.state.language_id,
        }),
      }
    );
    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };

    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "83ee3303b5mshe3c91dd9c4ca2edp189625jsn6bf5577eeeea", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);

      outputText.innerHTML = "";

      outputText.innerHTML += `Results :\n${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  };

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    // fetch('http://localhost:5000/upload ', {
    fetch('https://image-to-text.onrender.com/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((data) => {
        this.setState({ input:data.codetext});
        console.log(data.codetext)
      });
    });
}
  render() {
 
    return (
      <>
      <div className="container-fluid">
      
        <div className="solution">
           <i class="fa fa-bars" aria-hidden="true"></i>
           {/* <i class="bi bi-pencil-square"></i> */}
           <h1>  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>PAPER CODE</h1>
           <i className="fas fa-user fa-fw fa-md"></i>
          
        </div>
        <hr></hr>
       
        

        <div className="glass">

        <div className="upload-img">

          <h4>Upload the image of code here !!</h4>

           <form onSubmit={this.handleUploadImage}>
             <div className="filein">
                <input   ref={(ref) => { this.uploadInput = ref; }} type="file" />
             </div>
   
             <div>
                <button className="btn btn-info" >Upload</button>
             </div>
           </form>

        </div>
        </div>

       
      <div className="row">
         
       
         <div className="col-6 ml-4 mt-3 ">
         
           <AceEditor
            
               mode={this.state.language_compiler}
               theme="monokai"
               placeholder="Enter the code here !!"
               name="UNIQUE_ID_OF_DIV"
               fontSize={15}
               defaultValue= {this.state.textCode}
               highlightActiveLine={true}
               tabSize={3}
               width={740}
               height={600}
               showLineNumbers={true}
               enableBasicAutocompletion={true}
               onChange={newValue => {
                     this.onChange(newValue);
                   }}
               value={this.state.input}
           /> 
           
           <br></br>
           

           <div className="run">
            <div>
            {/* <button className="btn btn-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard2" viewBox="0 0 16 16">
  <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1h-.5Z"/>
  <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/>
</svg>
              
           </button>
           <button className="btn btn-info">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
</svg>
           </button> */}
               <label for="tags" className="mr-1">
             <b className="heading">Language:</b>
           </label>

           <select
             value={this.state.language_id}
             onChange={this.language}
             id="tags"
             className="form-control form-inline mb-2 language"
           >
             <option value="54">C++</option>
             <option value="50">C</option>
             <option value="62">Java</option>
             <option value="71">Python</option>
           </select>
            </div>
            
            
           <button
             type="submit"
             className="btn btn-danger ml-2 mr-2 "
             onClick={this.submit}
           >
             <i class="fas fa-cog fa-fw"></i> Run
           </button>
            </div>
         </div>

         <div class="input-output">

       <div className="mt-2 ml-5">
         <span className="badged ">
             Input
         </span>
         <br />
         <textarea id="input" onChange={this.userInput}></textarea>
       </div>

         <div className="  ml-5">
           <div>
             <span className="badged">
               Output
             </span>
             <br></br>
             <textarea id="output"></textarea>
           </div>
         </div>

         </div>

       </div>

      </div>
       
      </>
    );

  }
}

