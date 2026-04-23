import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';

export default function ConsultaScreen() {
  const [cedula, setCedula]     = useState('');
  const [nombre, setNombre]     = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading]   = useState(false);

  const consultar = async () => {
    if (!cedula.trim() && !nombre.trim()) {
      Alert.alert('Error', 'Ingresa cédula o nombre para buscar');
      return;
    }
    setLoading(true);
    setResultado(null);
    try {
      if (cedula.trim()) {
        const res = await axios.get(`${API_BASE.grades}/notas/${cedula.trim()}`);
        setResultado(res.data);
      } else {
        const res = await axios.get(`${API_BASE.students}/estudiantes/buscar/${nombre.trim()}`);
        if (res.data.length === 0) {
          Alert.alert('No encontrado', 'No existe un estudiante con ese nombre');
          return;
        }
        const cedRes = await axios.get(`${API_BASE.grades}/notas/${res.data[0].cedula}`);
        setResultado(cedRes.data);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al consultar';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Consulta de Notas</Text>

      <Text style={styles.label}>Cédula</Text>
      <TextInput
        style={styles.input}
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
        placeholder="Ej: 1001"
      />

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Juan Perez"
      />

      <TouchableOpacity style={styles.btnConsultar} onPress={consultar} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Consultar</Text>}
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultadoCard}>
          <Text style={styles.materiaLabel}>Materia: {resultado.materia}</Text>
          <View style={styles.filaNota}>
            <Text style={styles.notaLabel}>Nota 1</Text>
            <Text style={styles.notaValor}>{resultado.nota1 ?? '—'}</Text>
          </View>
          <View style={styles.filaNota}>
            <Text style={styles.notaLabel}>Nota 2</Text>
            <Text style={styles.notaValor}>{resultado.nota2 ?? '—'}</Text>
          </View>
          <View style={styles.filaNota}>
            <Text style={styles.notaLabel}>Nota 3</Text>
            <Text style={styles.notaValor}>{resultado.nota3 ?? '—'}</Text>
          </View>
          <View style={styles.filaNota}>
            <Text style={styles.notaLabel}>Nota 4</Text>
            <Text style={styles.notaValor}>{resultado.nota4 ?? '—'}</Text>
          </View>
          <View style={[styles.filaNota, styles.filaDef]}>
            <Text style={[styles.notaLabel, styles.defLabel]}>Definitiva</Text>
            <Text style={[styles.notaValor, styles.defValor]}>{resultado.definitiva ?? '—'}</Text>
          </View>
        </View>
      )}
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
  btnConsultar: {
    backgroundColor: '#3498db',
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultadoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  materiaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  filaNota: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filaDef: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  notaLabel: {
    fontSize: 15,
    color: '#555',
  },
  notaValor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  defLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  defValor: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
});
