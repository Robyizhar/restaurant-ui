import * as React from 'react';
import { LayoutOne, Card, FormControl, InputText, InputPassword, Button } from 'upkit';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { rules } from './validation';
import { registerUser } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import StoreLogo from '../../components/index';

// statuslist
const statuslist = {
    idle: 'idle', 
    process: 'process', 
    success: 'success', 
    error: 'error',
}

export default function Register(){

    // keluarkan fungsi `register`, `handleSubmit`, `errors`, `setError` dari `useForm`
    let { register, handleSubmit, formState: { errors }, setError } = useForm();

    // state status dengan nilai default `statuslist.idle`
    let [ status, setStatus ] = React.useState(statuslist.idle); 

    let navigate = useNavigate();
    
    // buat fungsi untuk menangani form submit 
        const onSubmit = async formData => {

            // dapatkan variabel password dan password_confirmation
            let { password, password_confirmation } = formData; 
            // cek password vs password_confirmation 
            if(password !== password_confirmation) {
                return setError('password_confirmation', {
                    type: 'equality',
                    message: 'Konfirmasi password harus dama dengan password'
                });
            }

            // set status = process 
            setStatus(statuslist.process);

            let { data } = await registerUser(formData);
            // cek apakah ada error
            if(data.error){
                // dapatkan field terkait jika ada errors
                let fields = Object.keys(data.fields);
                // untuk masing-masing field kita terapkan error dan tangkap pesan errornya
                fields.forEach(field => {
                    setError(field, {type: 'server', message: data.fields[field]?.properties?.message}) 
                });
                // set status = error 
                setStatus(statuslist.error);
                return;
            }
            // set status = success 
            setStatus(statuslist.success);
            // (1) redirect ke `register/berhasil` 
            navigate('/register/berhasil');

        }

    return (
        <LayoutOne size="small">
            <Card color="white">
                <div className="text-center mb-5">
                    <StoreLogo/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <InputText {...register('full_name', rules.full_name)} placeholder="Nama Lengkap" fitContainer />
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="full_name" /> </p>
                    </FormControl>
                    <FormControl>
                        <InputText {...register('email', rules.email)} placeholder="Email" fitContainer />
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="email" /> </p>
                    </FormControl>
                    <FormControl>
                        <InputPassword {...register('password', rules.password)} name="password" placeholder="Password" fitContainer />
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="password" /> </p>
                    </FormControl>
                    <FormControl>
                        <InputPassword {...register('password_confirmation', rules.password_confirmation)} name="password_confirmation" placeholder="Konfirmasi Password" fitContainer />
                        <p className="text-red-600 text-sm"> <ErrorMessage errors={errors} name="password_confirmation" /> </p>
                    </FormControl>
                    <Button
                        color="blue"
                        size="large" 
                        fitContainer
                        disabled={status === statuslist.process}
                    >  {status === statuslist.process ? "Sedang memproses" : "Mendaftar"} </Button>
                </form>
                <div className="text-center mt-2">
                    Sudah punya akun? 
                    <Link to="/login"> <b> Masuk Sekarang.</b> </Link>
                </div>
            </Card>
        </LayoutOne>
    )
}
