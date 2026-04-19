import React, { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Ui/Input';
import usePageTitle from '../hooks/usePageTitle';
import { useToast } from '../components/Ui/ToastProvider';

function Home() {
  const [name, setName] = useState("");
  const setUserName = useUserStore((s) => s.setUserName);
  const userName = useUserStore((s) => s.userName);
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleStartLogin() {
    // Validation is now handled in the Input component
    setUserName(name.trim());
    navigate("/app/dashboard");
  }

  usePageTitle("Home");

  useEffect(() => {
    if (userName) {
      navigate("/app/dashboard");
    }
  }, [userName, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Input
        name={name}
        setName={setName}
        handleStartLogin={handleStartLogin}
      />
    </motion.div>
  );
}

export default Home;