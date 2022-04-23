import * as React from 'react'; 
import { InputText, InputPassword, Button, FormControl, Card, LayoutOne} from 'upkit';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {useNavigate, Link} from 'react-router-dom';
import StoreLogo from '../../components/index';
import {useDispatch} from 'react-redux';
import {userLogin} from '../../features/Auth/actions';
import {rules} from './validation';
import { login } from '../../api/auth';

const statuslist = {
    idle: 'idle', 
    process: 'process', 
    success: 'success', 
    error: 'error'
}

export default function Login(){
    const { register, handleSubmit, formState: { errors }, setError } = useForm(); 
    const [status, setStatus] = React.useState(statuslist.idle);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // fungsi untuk menangani submit form
    const onSubmit = async ({email, password}) => {
        // set status menjadi `process`
        setStatus(statuslist.process);
        // kirim data ke Web API menggunakan helper `login`
        let { data } = await login(email, password); 
        // cek apakah server mengembalikan error
        if(data.error){
            // tangani error bertipe 'invalidCredential'
            setError('password', {type: 'invalidCredential', message: data.message});
            // set status menjadi `error`
            setStatus(statuslist.error);
        } else {
            // BERHASIL LOGIN 
            // ambil data `user` dan `token` dari respon server
            let {user, token} = data;
            // dispatch ke Redux store, action `userLogin` dengan data `user` dan `token`
            dispatch(userLogin(user, token));
            // redirect ke halaman home
            navigate('/');
        }
        setStatus(statuslist.success);
    }
    return (
        <LayoutOne size="small">
            <br/>
            <Card color="white">
                <div className="text-center mb-5">
                    <StoreLogo/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <InputText {...register('email', rules.email)} placeholder="email" fitContainer />
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="email" /> </p>
                    </FormControl>
                    <FormControl>
                        <InputPassword {...register('password', rules.password)} placeholder="password" fitContainer/>
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="password" /> </p>
                    </FormControl>
                    <Button fitContainer size="large" disabled={status === 'process'}>Login</Button>
                </form>
                <div className="text-center mt-2"> Belum punya akun? 
                    <Link to="/register">
                        <b>Daftar sekarang.</b>
                    </Link>
                </div>
            </Card>
        </LayoutOne>
    )
}