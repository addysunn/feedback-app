// SurveyForm shows a form to user to add input
import _ from 'lodash';
import React, { Component } from 'react';
//allows us to communicate with Redux store
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import fromFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return _.map(fromFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }
  render() {
    return (
      <div>
        {/* handleSubmit function is provided from reduxForm helper we wired up at the bottom */}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  //   if there is a name in Field called title and we set error object with title like below..
  //   then reduxForm will automatically connect the dots and pass this message which is controlloing this property
  //     if (!values.title) {
  //   errors.title = 'You must provide a Title';
  //     }

  errors.recipients = validateEmails(values.recipients || '');

  _.each(fromFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  // actual syntax is validate: validate but we using ES6 so just validate
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false,
})(SurveyForm);
