import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';
import { showAlert } from '../utils/alert';

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
      showAlert('Error', 'Ingresa una cédula');
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
      showAlert('Error', msg);
    } finally {
      setLoadBuscar(false);
    }
  };

  const guardar = async () => {
    if (!estudiante) {
      showAlert('Error', 'Primero consulta un estudiante');
      return;
    }
    for (const n of [nota1, nota2, nota3, nota4]) {
      const val = parseFloat(n);
      if (isNaN(val) || val < 0 || val > 5) {
        showAlert('Error', 'Las notas deben estar entre 0.0 y 5.0');
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
      showAlert('Éxito', `Notas guardadas. Definitiva: ${res.data.definitiva}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al guardar';
      showAlert('Error', msg);
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
      <View style={styles.card}>
        <Text style={styles.titulo}>📝 Registro de Notas</Text>
        <Text style={styles.subtitulo}>Busca un estudiante e ingresa sus notas</Text>

        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
          placeholder="Ej: 1001"
          placeholderTextColor="#D18EA8"
        />

        <TouchableOpacity style={styles.btnConsultar} onPress={buscarEstudiante} disabled={loadBuscar}>
          {loadBuscar
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>🔍 Consultar</Text>}
        </TouchableOpacity>
      </View>

      {estudiante && (
        <View style={styles.notasCard}>
          <Text style={styles.nombreLabel}>{estudiante.nombre}</Text>
          <Text style={styles.materiaChip}>{estudiante.materia}</Text>

          <Text style={styles.label}>Nota 1</Text>
          <TextInput
            style={styles.input}
            value={nota1}
            onChangeText={v => handleNotaChange(setNota1, v, v, nota2, nota3, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
            placeholderTextColor="#D18EA8"
          />

          <Text style={styles.label}>Nota 2</Text>
          <TextInput
            style={styles.input}
            value={nota2}
            onChangeText={v => handleNotaChange(setNota2, v, nota1, v, nota3, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
            placeholderTextColor="#D18EA8"
          />

          <Text style={styles.label}>Nota 3</Text>
          <TextInput
            style={styles.input}
            value={nota3}
            onChangeText={v => handleNotaChange(setNota3, v, nota1, nota2, v, nota4)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
            placeholderTextColor="#D18EA8"
          />

          <Text style={styles.label}>Nota 4</Text>
          <TextInput
            style={styles.input}
            value={nota4}
            onChangeText={v => handleNotaChange(setNota4, v, nota1, nota2, nota3, v)}
            keyboardType="decimal-pad"
            placeholder="0.0 – 5.0"
            placeholderTextColor="#D18EA8"
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
                : <Text style={styles.btnText}>💾 Guardar</Text>}
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
    backgroundColor: '#FFF5F7',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    shadowColor: '#E91E63',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 18,
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
    marginBottom: 18,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#880E4F',
    marginBottom: 5,
  },
  nombreLabel: {
    fontSize: 18,
    color: '#880E4F',
    fontWeight: 'bold',
    textAlign: 'center',
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
  btnConsultar: {
    backgroundColor: '#F06292',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#F06292',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  btnGuardar: {
    backgroundColor: '#E91E63',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#E91E63',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  notasCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    elevation: 3,
  },
  materiaChip: {
    backgroundColor: '#F06292',
    color: '#fff',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    fontSize: 13,
    overflow: 'hidden',
  },
  accionesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  defBox: {
    backgroundColor: '#FCE4EC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: '#E91E63',
  },
  defLabel: {
    fontSize: 12,
    color: '#880E4F',
    fontWeight: '600',
  },
  defValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C2185B',
  },
});
