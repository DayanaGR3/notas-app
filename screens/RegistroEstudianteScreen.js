import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';

export default function RegistroEstudianteScreen() {
  const [cedula,   setCedula]   = useState('');
  const [nombre,   setNombre]   = useState('');
  const [correo,   setCorreo]   = useState('');
  const [celular,  setCelular]  = useState('');
  const [materia,  setMateria]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const limpiar = () => {
    setCedula('');
    setNombre('');
    setCorreo('');
    setCelular('');
    setMateria('');
  };

  const registrar = async () => {
    if (!cedula.trim() || !nombre.trim() || !materia.trim()) {
      Alert.alert('Error', 'Cédula, nombre y materia son obligatorios');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE.students}/estudiantes`, {
        cedula:  cedula.trim(),
        nombre:  nombre.trim(),
        correo:  correo.trim() || undefined,
        celular: celular.trim() || undefined,
        materia: materia.trim(),
      });
      Alert.alert('Éxito', `Estudiante ${nombre} registrado correctamente`, [
        { text: 'OK', onPress: limpiar },
      ]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrar';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Estudiante</Text>

      <Text style={styles.label}>Cédula *</Text>
      <TextInput
        style={styles.input}
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
        placeholder="Número de cédula"
      />

      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre completo"
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        placeholder="correo@ejemplo.com"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Celular</Text>
      <TextInput
        style={styles.input}
        value={celular}
        onChangeText={setCelular}
        keyboardType="phone-pad"
        placeholder="Ej: 3001234567"
      />

      <Text style={styles.label}>Materia *</Text>
      <TextInput
        style={styles.input}
        value={materia}
        onChangeText={setMateria}
        placeholder="Ej: Matemáticas"
      />

      <TouchableOpacity style={styles.btnRegistrar} onPress={registrar} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Registrar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  btnRegistrar: {
    backgroundColor: '#27ae60',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
