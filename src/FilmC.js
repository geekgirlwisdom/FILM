import React, {Component } from 'react'; 
import HandleErrors from './HandleErrors';

class FilmC extends  Component { 
 
 	constructor(props) {
		super(props);
		this.state = {
      filmresult : [] , 
      totalresults: 0,
      filmresp: false,
      filmlist: [],
      currentpage: 1,
      pagination: [] 
		};
	}   
   
  /* Fetches url results */
  fetchResults = (page = 1) =>
  {
   
    let url = "http://www.omdbapi.com/?apikey=7c121a3d"
    if   (this.state.title && typeof(this.state.title) !== 'undefined' && this.state.title.length > 0) 
    {
      url += "&s='"+this.state.title + "'"; 
      if ( (this.state.type && typeof(this.state.type) !=='undefined'  && this.state.type.length > 0))
        url += "&type="+this.state.type;
      url += "&page="+ page; 
      fetch(url)
      .then(filmres  => filmres.json())
      .then(filmres => {this.setState({ filmlist :  filmres.Search  , 
                        filmresp : filmres.Response,  
                        totalresults : filmres.totalResults, 
                        currentpage: page,
                        pagination: [],
                        filmresult : [filmres  ] }); } ) 
      .catch((err) =>  {	HandleErrors(err); });
    }
}

	componentDidMount() {  
	  	this.fetchResults();
	}
 
  /* handleChange - Grabs value of the input/type boxes and adds to state */
  handleChange  =  e  =>  {	
		 this.setState({ [e.target.name]: e.target.value, value: e.target.value })
	} 
 
  /* HandlePagination */
 handlePages = e => {
   this.fetchResults(e.target.id);
  e.preventDefault()
 }

  /* Calls fetchresult when clicked */
	submit = e => {
		try{
	 	  this.fetchResults()
			e.preventDefault()
		}
		catch(err)
		{
			HandleErrors(err)
		}
	}
		
	render() { 
    
    let filmbody; 
    let i =0;
    try{
    if (this.state.filmresult[0].Error) //(this.state.totalresults === undefined || this.state.totalresults === 0 || this.state.filmresp === false)
    {
      console.log( this.state.filmresult[0].Error);
             filmbody = <tr><td colSpan="4"> {this.state.filmresult[0].Error} No Results are currently available</td></tr> ;
    }
    else if ( this.state.totalresults > 0 )
     {  filmbody =   this.state.filmlist.map( (f,i) => (
              <tr key={f.imdbID} className="film" id={f.imdbID}> 
              <td className="img"><div className='imgcrop'><img alt={f.Title} src= {f.Poster === 'N/A' ? 'https://www.pngkey.com/png/full/816-8162670_light-blue-box-light-blue-overlay-transparent.png' : f.Poster}  /></div></td>
              <td className="title">{f.Title} </td>
              <td className="type">{(f.Type).toUpperCase()}</td>
              <td className="year">{f.Year}</td>
              </tr>
            ))
            
            if (this.state.totalresults !== undefined && this.state.totalresults > 10 && this.state.pagination.length < 1 )
              for (i=1; i <  this.state.totalresults % 10 ; i++)
              {
                this.state.pagination.push(i);
              }
             
     }
    }
    catch(err)    
    { HandleErrors (err)}
    return (
      <div className="grid_6">
      <h4>Search</h4>
      <label id="error"></label>
        <div className="row">
          <form onSubmit={this.submit}>
          <div className="page"><div className="pagination"> {  this.state.pagination.map(  (i  =>  (<a  href="#{i}" id={i} name={i} onClick={this.handlePages} className={(this.state.currentpage === i).toString() } >{i}</a>) ))	} </div></div>
  
          <div className="grid_3">
            <input name="title"   onChange={ this.handleChange } />
            <button className="btn" name="submit" type="submit">Submit</button>
          
          </div>
          <div className="grid_3" id="options">
            <select name="type" id="filmtype" onChange={ this.handleChange }>
              <option value="">Film Type</option>
              <option>Movie</option>
              <option>Series</option>
              <option>Episode</option>
            </select>
          </div>
          </form>
        </div> 
      <div className="row" id="results">       
      <div className='filmresults'>
        <h4 className={(this.state.filmresp).toString()}>Results</h4>
        <table>
          <thead className={(this.state.filmresp).toString()}>
            <tr>
              <th>Film</th>
              <th>Title</th>
              <th>Type</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>   
            {filmbody}
             
          </tbody>
        </table>
      </div>
      </div>
    </div>
      );
    }
}


export default FilmC
