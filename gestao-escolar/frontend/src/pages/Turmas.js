import React, { useEffect, useState } from 'react';
import api from '../services/api';

const VAZIO = { nome: '', serie: '', turno: 'manha', ano_letivo: new Date().getFullYear(), professor_id: '' };

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const [t, p] = await Promise.all([api.get('/turmas'), api.get('/professores')]);
    setTurmas(t.data);
    setProfessores(p.data);
  }

  function abrirNovo() {
    setForm(VAZIO);
    setEditandoId(null);
    setMostrarForm(true);
    setErro('');
  }

  function abrirEditar(t) {
    setForm({ nome: t.nome, serie: t.serie, turno: t.turno, ano_letivo: t.ano_letivo, professor_id: t.professor_id || '' });
    setEditandoId(t.id);
    setMostrarForm(true);
    setErro('');
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        await api.put(`/turmas/${editandoId}`, form);
        setSucesso('Turma atualizada!');
      } else {
        await api.post('/turmas', form);
        setSucesso('Turma cadastrada!');
      }
      setMostrarForm(false);
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir esta turma?')) return;
    try {
      await api.delete(`/turmas/${id}`);
      setSucesso('Turma excluída!');
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir.');
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>🏫 Turmas</h2>
        <button style={styles.btnPrimario} onClick={abrirNovo}>+ Nova Turma</button>
      </div>

      {sucesso && <div style={styles.sucesso}>{sucesso}</div>}

      {mostrarForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitulo}>{editandoId ? 'Editar Turma' : 'Nova Turma'}</h3>
          {erro && <div style={styles.erro}>{erro}</div>}
          <form onSubmit={salvar} style={styles.form}>
            <Campo label="Nome da Turma" required>
              <input style={styles.input} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            </Campo>
            <Campo label="Série/Ano" required>
              <input style={styles.input} value={form.serie} onChange={e => setForm({ ...form, serie: e.target.value })} required />
            </Campo>
            <Campo label="Turno" required>
              <select style={styles.input} value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })}>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noturno">Noturno</option>
              </select>
            </Campo>
            <Campo label="Ano Letivo" required>
              <input style={styles.input} type="number" value={form.ano_letivo} onChange={e => setForm({ ...form, ano_letivo: e.target.value })} required />
            </Campo>
            <Campo label="Professor Responsável">
              <select style={styles.input} value={form.professor_id} onChange={e => setForm({ ...form, professor_id: e.target.value })}>
                <option value="">-- Selecionar --</option>
                {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </Campo>
            <div style={styles.formBotoes}>
              <button type="submit" style={styles.btnPrimario}>Salvar</button>
              <button type="button" style={styles.btnSecundario} onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.tabela}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Série</th>
              <th style={styles.th}>Turno</th>
              <th style={styles.th}>Ano Letivo</th>
              <th style={styles.th}>Professor</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.length === 0 && (
              <tr><td colSpan={6} style={styles.vazio}>Nenhuma turma cadastrada.</td></tr>
            )}
            {turmas.map((t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}>{t.nome}</td>
                <td style={styles.td}>{t.serie}</td>
                <td style={styles.td}>{t.turno}</td>
                <td style={styles.td}>{t.ano_letivo}</td>
                <td style={styles.td}>{t.professor_nome || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.btnEditar} onClick={() => abrirEditar(t)}>Editar</button>
                  <button style={styles.btnExcluir} onClick={() => excluir(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Campo({ label, children, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titulo: { margin: 0, color: '#1e3a5f', fontSize: 22 },
  sucesso: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 },
  erro: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 12, fontSize: 14 },
  formCard: { background: '#fff', borderRadius: 10, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 600 },
  formTitulo: { margin: '0 0 16px', color: '#1e3a5f' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  formBotoes: { gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 8 },
  btnPrimario: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  btnSecundario: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  tableWrapper: { background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: '#1e3a5f' },
  th: { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: 13, fontWeight: 600 },
  td: { padding: '11px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f1f5f9' },
  vazio: { padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  btnEditar: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12, marginRight: 6 },
  btnExcluir: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
};
