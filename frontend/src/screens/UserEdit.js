import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '../actions/user';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { USER_UPDATE_RESET } from '../actions/types';

const UserEdit = ({ history, match }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/users');
    } else {
      if (!user.name || user._id !== match.params.id) {
        dispatch(getUserDetails(match.params.id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, match, user, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: match.params.id, name, email, isAdmin }));
  };

  return (
    <>
      <Link to='/admin/users' className='btn btn-light my-3'>
        Voltar
      </Link>

      <FormContainer>
        <h1>Atualizar dados do cliente</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Nome do cliente'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Email do cliente'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Administrador?'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Atualizar dados do cliente
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEdit;
