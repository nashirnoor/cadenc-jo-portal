import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




const CustomButton = styled(Button)({
    backgroundColor: 'black',
    color: 'white',
});


const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const jwt_access = localStorage.getItem('access');

    useEffect(() => {
        if (!jwt_access && !user) {
            navigate("/login");
        } else {
            getSomeData();
        }
    }, [jwt_access, user, navigate]);
  
    const refresh = JSON.parse(localStorage.getItem('refresh'));
  
    const getSomeData = async () => {
        try {
            const resp = await axiosInstance.get("/auth/profile/");
            if (resp.status === 200) {
                console.log(resp.data, "Profile data");
            } else {
                console.log(resp.status, "Error fetching profile data");
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };  

    const handleLogout = async () => {
        try {
            const refresh_token = JSON.parse(localStorage.getItem('refresh'));
            await axiosInstance.post("/auth/logout/", { refresh_token });
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            navigate('/login');
            toast.success("Logout successful");
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
<div className='px-4 lg:px-28 flex justify-between h-24 items-center'>
<h1 className='font-semibold text-4xl'><Link to="/about">Cadenc</Link> </h1>
<div className='flex'>
    <h2 className='pr-6 pt-1 font-bold'><Link to="/about">About</Link></h2>
    <h2 className='pr-6 pt-1 font-bold'>Profile</h2>
    <h2 className='pr-6 pt-1 font-bold'><Link to="/company-list">Companies</Link></h2>
    <h2 className='pt-1 font-bold'><Link to="/find-jobs">Find Job</Link></h2>

</div>
{/* <div className='flex'>
    <h2 className='pr-6 pt-1 font-semibold'><Link to='/'>Register</Link></h2>
    <CustomButton variant="contained"><Link to="/login">Login</Link></CustomButton>
</div> */}
            <div>
            {/* <img src={"/images/profile-user.png"} alt="profile-img" className="h-11 w-11"/> */}

                {jwt_access && user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">Login</Link>
                        <Link to="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Signup</Link>
                    </>
                )}
            </div>
            </div>
    );
};

export default Header;



