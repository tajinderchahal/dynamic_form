import React, { Component} from 'react';
import './App.css';

class DynamicForm extends Component {
  constructor() {
    super();
    this.state = {
      "loading": true
    };
  }

  componentDidMount() {
    this.getForm();
  }

  getForm() {
    fetch('/api/v1/form?id=3634968')
      .then(res => res.json())
      .then((data) => {
        this.setState({ form: data });
        this.getFormData();
      })
  }

  getFormData() {
    fetch('/api/v1/data?id=551042206')
      .then(res => res.json())
      .then((data) => {
        this.setState({ formData: data, loading: false});
      })
  }

  getLoader() {
    return (<div className="preloader-wrapper small active" style={{margin: "0 auto"}}>
    <div className="spinner-layer spinner-green-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
    </div>);
  }

  formatData(field, data) {
    switch(field.type) {
      case "name":
        var fullName = data["value"].split('\n');
        var name = fullName[0].split('=')[1] + " " + fullName[1].split('=')[1]
        return name;
        break;
      case "address":
        var fullAddress = data["value"].split('\n');
        var streetAddress = fullAddress[0].split('=')[1]
        var city = fullAddress[1].split('=')[1]
        var state = fullAddress[2].split('=')[1]
        var zip = fullAddress[3].split('=')[1]
        return (<div>
          <div>{streetAddress}</div>
          <div>{city + " " + state + " " + zip}</div>
        </div>);
      default:
        return data["value"];
    }
  }

  createForm() {
    var that = this;
    var formIdDataMap = {};
    // re formatting data into {"<field_id>": "<field_data>"}
    for(var i=0; i < this.state.formData.data.length;i++) {
      var data = this.state.formData.data[i];
      formIdDataMap[data.field] = data;
    };

    var formTable = (<tbody className="left-align">
        { 
          this.state.form.fields.map(function(field, i) {
            if(formIdDataMap[field.id]) {
              return (<tr key={i}>
                <td className="App-table-row">{field.label}</td> 
                <td className="App-table-row">{that.formatData(field, formIdDataMap[field.id])}</td>
              </tr>)
            }
          })
        } </tbody>);

    return (<div className="row">
        <div className="col s12 center-align" style={{padding: "20px"}}>
          <h4>{this.state.form.name}</h4>
        </div>
        <div className="col s12">
          <table class="striped">{formTable}</table>
        </div> 
      </div>
    )
  }

  render() {
    var content = null;
    if(this.state.loading) {
      content = <div className="center-align">{this.getLoader()}</div>;
    } else {
      content = this.createForm();
    }
 
    var formHtml = (
      <div className="container">
        <div className="row" style={{marginTop: "40px"}}>
          <div className="col s12">{content}</div> 
        </div>
      </div>)
    return formHtml;
  } 
}


export default DynamicForm;
