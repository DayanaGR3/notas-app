import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import axios from 'axios';
import API_BASE from '../constants/api';
import { showAlert } from '../utils/alert';

export default function ConsultaScreen() {
  const [cedula, setCedula]       = useState('');
  const [nombre, setNombre]       = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading]     = useState(false);

  const consultar = async () => {
    if (!cedula.trim() && !nombre.trim()) {
      showAlert('Error', 'Ingresa cédula o nombre para buscar');
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
          showAlert('No encontrado', 'No existe un estudiante con ese nombre');
          return;
        }
        const cedRes = await axios.get(`${API_BASE.grades}/notas/${res.data[0].cedula}`);
        setResultado(cedRes.data);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al consultar';
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>🌸 Consulta de Notas</Text>
        <Text style={styles.subtitulo}>Busca por cédula o nombre</Text>

        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
          placeholder="Ej: 1001"
          placeholderTextColor="#D18EA8"
        />

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Juan Perez"
          placeholderTextColor="#D18EA8"
        />

        <TouchableOpacity style={styles.btnConsultar} onPress={consultar} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Consultar</Text>}
        </TouchableOpacity>
      </View>

      {resultado && (
        <View style={styles.resultadoCard}>
          <Text style={styles.nombreResult}>{resultado.nombre}</Text>
          <Text style={styles.materiaChip}>{resultado.materia}</Text>

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

          <View style={styles.defBox}>
            <Text style={styles.defLabel}>Definitiva</Text>
            <Text style={styles.defValor}>{resultado.definitiva ?? '—'}</Text>
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
    backgroundColor: '#E91E63',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
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
  resultadoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    elevation: 3,
  },
  nombreResult: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#880E4F',
    textAlign: 'center',
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
  filaNota: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FCE4EC',
  },
  notaLabel: {
    fontSize: 15,
    color: '#6A1B4A',
  },
  notaValor: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A148C',
  },
  defBox: {
    backgroundColor: '#FCE4EC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#E91E63',
  },
  defLabel: {
    fontSize: 13,
    color: '#880E4F',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  defValor: {
    fontSize: 26,
    color: '#C2185B',
    fontWeight: 'bold',
    marginTop: 2,
  },
});
