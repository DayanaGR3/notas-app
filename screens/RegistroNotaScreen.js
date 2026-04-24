import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';

export default function RegistroNotaScreen() {
  const [cedula,     setCedula]     = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [nota1,      setNota1]      = useState('');
  const [nota2,      setNota2]      = useState('');
  const [nota3,      setNota3]      = useState('');
  const [nota4,      setNota4]      = useState('');
  const [definitiva, setDefinitiva] = useState(null);
  const [loadBuscar, setLoadBuscar] = useState(false);
  const [loadGuardar,setLoadGuardar]= useState(false);

  const calcularDef = (n1, n2, n3, n4) => {
    const vals = [n1, n2, n3, n4].map(v => parseFloat(v) || 0);
    return (vals.reduce((a, b) => a + b, 0) / 4).toFixed(2);
  };

  const actualizarDefinitiva = (n1, n2, n3, n4) => {
    setDefinitiva(calcularDef(n1, n2, n3, n4));
  };

  const buscarEstudiante = async () => {
    if (!cedula.trim()) {
      Alert.alert('Error', 'Ingresa una cédula');
      return;
    }
    setLoadBuscar(true);
    setEstudiante(null);
    setNota1(''); setNota2(''); setNota3(''); setNota4('');
    setDefinitiva(null);
    try {
      const res = await axios.get(`${API_BASE.grades}/notas/${cedula.trim()}`);
      setEstudiante(res.data);
      const n1 = String(res.data.nota1 ?? '');
      const n2 = String(res.data.nota2 ?? '');
      const n3 = String(res.data.nota3 ?? '');
      const n4 = String(res.data.nota4 ?? '');
      setNota1(n1); setNota2(n2); setNota3(n3); setNota4(n4);
      if (n1 && n2 && n3 && n4) setDefinitiva(calcularDef(n1, n2, n3, n4));
    } catch (err) {
      const msg = err.response?.data?.error || 'Estudiante no encontrado';
      Alert.alert('Error', msg);
    } finally {
      setLoadBuscar(false);
    }
  };

  const guardar = async () => {
    if (!estudiante) {
      Alert.alert('Error', 'Primero consulta un estudiante');
      return;
    }
    const notas = [nota1, nota2, nota3, nota4];
    for (const n of notas) {
      const val = parseFloat(n);
      if (isNaN(val) || val < 0 || val > 5) {
        Alert.alert('Error', 'Las notas deben estar entre 0.0 y 5.0');
        return;
      }
    }
    setLoadGuardar(true);
    try {
      const res = await axios.post(`${API_BASE.grades}/notas`, {
        cedula: cedula.trim(),
        nota1: parseFloat(nota1),
        nota2: parseFloat(nota2),
        nota3: parseFloat(nota3),
        nota4: parseFloat(nota4),
      });
      setDefinitiva(res.data.definitiva);
      Alert.alert('Éxito', `Notas guardadas. Definitiva: ${res.data.definitiva}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al guardar';
      Alert.alert('Error', msg);
    } finally {
      setLoadGuardar(false);
    }
  };

  const handleNotaChange = (setter, value, n1, n2, n3, n4) => {
    setter(value);
    actualizarDefinitiva(n1, n2, n3, n4);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registro de Notas</Text>

      <Text style={styles.label}>Cédula</Text>
      <TextInput
        style={styles.input}
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
        placeholder="Ej: 1001"
      />

      {estudiante && (
        <Text style={styles.nombreLabel}>Estudiante: {estudiante.nombre}</Text>
      )}

      <TouchableOpacity style={styles.btnConsultar} onPress={buscarEstudiante} disabled={loadBuscar}>
        {loadBuscar
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Consultar</Text>}
      </TouchableOpacity>

      {estudiante && (
        <View style={styles.notasCard}>
          <Text style={styles.materiaChip}>{estudiante.materia}</Text>

          <Text style={styles.label}>Nota 1</Text>
          <TextInput
            style={styles.input}
            value={nota1}
            onChangeText={v => handleNotaChange(setNota1, v, v, nota2, nota3, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
          />

          <Text style={styles.label}>Nota 2</Text>
          <TextInput
            style={styles.input}
            value={nota2}
            onChangeText={v => handleNotaChange(setNota2, v, nota1, v, nota3, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
          />

          <Text style={styles.label}>Nota 3</Text>
          <TextInput
            style={styles.input}
            value={nota3}
            onChangeText={v => handleNotaChange(setNota3, v, nota1, nota2, v, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
          />

          <Text style={styles.label}>Nota 4</Text>
          <TextInput
            style={styles.input}
            value={nota4}
            onChangeText={v => handleNotaChange(setNota4, v, nota1, nota2, nota3, v)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
          />

          <View style={styles.accionesRow}>
            {definitiva !== null && (
              <View style={styles.defBox}>
                <Text style={styles.defLabel}>Definitiva</Text>
                <Text style={styles.defValor}>{definitiva}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar} disabled={loadGuardar}>
              {loadGuardar
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.btnText}>Guardar</Text>}
            </TouchableOpacity>
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
  nombreLabel: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnGuardar: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  notasCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  materiaChip: {
    backgroundColor: '#3498db',
    color: '#fff',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    fontSize: 14,
  },
  accionesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  defBox: {
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  defLabel: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  defValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});
