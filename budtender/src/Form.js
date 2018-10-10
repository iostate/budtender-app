import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button, Paper, TextField, Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
// gql
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';

const styles = theme => ({
  button: {
    margin: 'auto',
    display: 'flex',
    width: '60%',
    border: '3xps solid #73AD21',
    padding: '10px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
});

const BudtenderQuery = gql`
  {
    budtenders {
      firstName
      lastName
      age
      dhsNumber
    }
  }
`;

const CreateBudtenderMutation = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $age: Number!
    $dhsNumber: Number!
  ) {
    createBudtender(
      firstName: $firstName
      lastName: $lastName
      age: $age
      dhsNumber: $dhsNumber
    ) {
      firstName
      lastName
      age
      dhsNumber
    }
  }
`;

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      age: '',
      dhsNumber: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // createBudtender = async (firstName, lastName, age, dhsNumber) => {
  //   console.log('Submitting...');
  //   // create todo
  //   await this.props.createBudtender({
  //     variables: {
  //       firstName,
  //       lastName,
  //       age,
  //       dhsNumber,
  //     },
  //     // destructured {data: {createTpdo}} contains the
  //     // id, text, and complete fields
  //     update: (store, {data: {createBudtender}}) => {
  //       // Read the data from our cachce for this query.
  //       const data = store.readQuery({query: BudtenderQuery});
  //       // Look for ID, and keep the posts whose ID do not match.
  //       // Filter function works by removing any posts that don't match the ID,
  //       // and so, the ID that does not match is removed.
  //       data.todos.unshift(createBudtender);
  //       // Write our data back to the cache.
  //       store.writeQuery({query: BudtenderQuery, data});
  //     },
  //   });
  // };
  createBudtender = async values => {
    await this.props.createBudtender({
      variables: {
        firstName,
        lastName,
        age,
        dhsNumber,
      },
      update: (store, {data: {createBudtender}}) => {
        const data = store.readQuery({query: BudtenderQuery});

        data.todos.unshift(createBudtender);
        store.writeQuery({query: BudtenderQuery, data});
      },
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    console.log(name + ': ' + event.target.value);
  };

  handleSubmit(event) {
    console.log('First Name: ' + this.state.firstName);
    console.log('Last Name: ' + this.state.lastName);
    console.log('Age: ' + this.state.age);
    console.log('DHS Number: ' + this.state.dhsNumber);
  }

  render() {
    const {classes} = this.props;
    return (
      <Fragment>
        <Paper elevation={1}>
          <Typography variant="headline" component="h4">
            Budtender Registration
          </Typography>

          {/* Begin Form */}
          <form className={classes.root} onSubmit={this.createBudtender()}>
            <div className={classes.root.paddingBottom}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-name"
                      label="First Name"
                      className={classes.textField}
                      value={this.state.firstName}
                      onChange={this.handleChange('firstName')}
                      margin="normal"
                      fullWidth
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-name"
                      label="Last Name"
                      className={classes.textField}
                      value={this.state.lastName}
                      onChange={this.handleChange('lastName')}
                      margin="normal"
                      fullWidth
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-name"
                      label="Age"
                      className={classes.textField}
                      value={this.state.age}
                      onChange={this.handleChange('age')}
                      margin="normal"
                      fullWidth
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-name"
                      label="AZ DHS #"
                      className={classes.textField}
                      value={this.state.dhsNumber}
                      onChange={this.handleChange('dhsNumber')}
                      margin="normal"
                      fullWidth
                    />
                  </Paper>
                </Grid>
              </Grid>
            </div>

            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Fragment>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(Form);
export default compose(
  graphql(CreateBudtenderMutation, {name: 'createBudtender'}),
  graphql(BudtenderQuery),
  withStyles(styles)
)(Form);
