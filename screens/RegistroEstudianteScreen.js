import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';
import { showAlert } from '../utils/alert';

export default function RegistroEstudianteScreen() {
  const [cedula,  setCedula]  = useState('');
  const [nombre,  setNombre]  = useState('');
  const [correo,  setCorreo]  = useState('');
  const [celular, setCelular] = useState('');
  const [materia, setMateria] = useState('');
  const [loading, setLoading] = useState(false);

  const limpiar = () => {
    setCedula(''); setNombre(''); setCorreo(''); setCelular(''); setMateria('');
  };

  const registrar = async () => {
    if (!cedula.trim() || !nombre.trim() || !materia.trim()) {
      showAlert('Error', 'Cédula, nombre y materia son obligatorios');
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
      showAlert('Éxito', `Estudiante ${nombre} registrado correctamente`, [
        { text: 'OK', onPress: limpiar },
      ]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrar';
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>💖 Registro de Estudiante</Text>
        <Text style={styles.subtitulo}>Completa los datos del estudiante</Text>

        <Text style={styles.label}>Cédula *</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
          placeholder="Número de cédula"
          placeholderTextColor="#D18EA8"
        />

        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre completo"
          placeholderTextColor="#D18EA8"
        />

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#D18EA8"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Celular</Text>
        <TextInput
          style={styles.input}
          value={celular}
          onChangeText={setCelular}
          keyboardType="phone-pad"
          placeholder="Ej: 3001234567"
          placeholderTextColor="#D18EA8"
        />

        <Text style={styles.label}>Materia *</Text>
        <TextInput
          style={styles.input}
          value={materia}
          onChangeText={setMateria}
          placeholder="Ej: Matemáticas"
          placeholderTextColor="#D18EA8"
        />

        <TouchableOpacity style={styles.btnRegistrar} onPress={registrar} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>✨ Registrar</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5F7',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    shadowColor: '#E91E63',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#880E4F',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: '#AD1457',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#880E4F',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1.5,
    borderColor: '#F8BBD0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#4A148C',
  },
  btnRegistrar: {
    backgroundColor: '#E91E63',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#E91E63',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
