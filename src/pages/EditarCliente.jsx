import { Form, useNavigate, useLoaderData, useActionData, redirect } from 'react-router-dom';
import Formulario from '../components/Formulario';
import { obtenerCliente, actualizarCliente } from '../data/Clientes';
import Error from '../components/Error';

export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId);
  if (Object.values(cliente).length === 0) {
    throw new Response('', {
      status: 404,
      statusText: 'El cliente no fue encontrado',
    });
  }

  return cliente;
}

export async function action({ request, params }) {
  const formData = await request.formData();

  const datos = Object.fromEntries(formData);

  const email = formData.get('email');

  //Validacion
  const errores = [];
  if (Object.values(datos).includes('')) {
    errores.push('Todos los campos son obligatorios');
  }

  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  if (!regex.test(email)) {
    errores.push('El email no es válido');
  }

  //Retornar datos si hay errores
  if (Object.keys(errores).length) {
    return errores;
  }

  //Actualizar el cliente

  await actualizarCliente(params.clienteId, datos);
  return redirect('/');
}

function EditarCliente() {
  const navigate = useNavigate();
  const cliente = useLoaderData();
  const errores = useActionData();

  return (
    <>
      <h1 className='font-black text-4xl text-blue-900'>Editar cliente</h1>
      <p className='mt-3'>A continuación podrás modificar los datos de un cliente</p>

      <div className='md:flex justify-end m-4'>
        <button
          className='bg-blue-800 hover:bg-blue-500 rounded text-white px-3 py-1 font-bold uppercase'
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      <div className='bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10'>
        {errores?.length && errores.map((error, i) => <Error key={i}>{error}</Error>)}

        <Form method='post' noValidate>
          <Formulario cliente={cliente} />

          <input
            type='submit'
            className='mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white cursor-pointer text-lg hover:bg-blue-500'
            value='Guardar cambios'
          />
        </Form>
      </div>
    </>
  );
}

export default EditarCliente;
