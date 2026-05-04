import React, { useEffect, useState } from 'react';
import api from '../services/api';

const VAZIO = { nome: '', cpf: '', data_nascimento: '', email: '', responsavel: '', turma_id: '' };

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const [a, t] = await Promise.all([api.get('/alunos'), api.get('/turmas')]);
    setAlunos(a.data);
    setTurmas(t.data);
  }

  function abrirNovo() {
    setForm(VAZIO);
    setEditandoId(null);
    setMostrarForm(true);
    setErro('');
  }

  function abrirEditar(a) {
    setForm({
      nome: a.nome, cpf: a.cpf,
      data_nascimento: a.data_nascimento?.substring(0, 10),
      email: a.email || '', responsavel: a.responsavel || '',
      turma_id: a.turma_id || ''
    });
    setEditandoId(a.id);
    setMostrarForm(true);
    setErro('');
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        await api.put(`/alunos/${editandoId}`, form);
        setSucesso('Aluno atualizado!');
      } else {
        await api.post('/alunos', form);
        setSucesso('Aluno cadastrado!');
      }
      setMostrarForm(false);
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este aluno?')) return;
    try {
      await api.delete(`/alunos/${id}`);
      setSucesso('Aluno excluído!');
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir.');
    }
  }

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.cpf.includes(busca)
  );

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>🎒 Alunos</h2>
        <button style={styles.btnPrimario} onClick={abrirNovo}>+ Novo Aluno</button>
      </div>

      {sucesso && <div style={styles.sucesso}>{sucesso}</div>}

      {mostrarForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitulo}>{editandoId ? 'Editar Aluno' : 'Novo Aluno'}</h3>
          {erro && <div style={styles.erro}>{erro}</div>}
          <form onSubmit={salvar} style={styles.form}>
            <Campo label="Nome Completo" required>
              <input style={styles.input} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            </Campo>
            <Campo label="CPF" required>
              <input style={styles.input} value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" required />
            </Campo>
            <Campo label="Data de Nascimento" required>
              <input style={styles.input} type="date" value={form.data_nascimento} onChange={e => setForm({ ...form, data_nascimento: e.target.value })} required />
            </Campo>
            <Campo label="E-mail">
              <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </Campo>
            <Campo label="Responsável">
              <input style={styles.input} value={form.responsavel} onChange={e => setForm({ ...form, responsavel: e.target.value })} />
            </Campo>
            <Campo label="Turma">
              <select style={styles.input} value={form.turma_id} onChange={e => setForm({ ...form, turma_id: e.target.value })}>
                <option value="">-- Sem turma --</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.ano_letivo})</option>)}
              </select>
            </Campo>
            <div style={styles.formBotoes}>
              <button type="submit" style={styles.btnPrimario}>Salvar</button>
              <button type="button" style={styles.btnSecundario} onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <input
        style={styles.busca}
        placeholder="🔍 Buscar por nome ou CPF..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <div style={styles.tableWrapper}>
        <table style={styles.tabela}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>CPF</th>
              <th style={styles.th}>Nascimento</th>
              <th style={styles.th}>Responsável</th>
              <th style={styles.th}>Turma</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length === 0 && (
              <tr><td colSpan={6} style={styles.vazio}>Nenhum aluno encontrado.</td></tr>
            )}
            {alunosFiltrados.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}>{a.nome}</td>
                <td style={styles.td}>{a.cpf}</td>
                <td style={styles.td}>{a.data_nascimento?.substring(0, 10)}</td>
                <td style={styles.td}>{a.responsavel || '—'}</td>
                <td style={styles.td}>{a.turma_nome || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.btnEditar} onClick={() => abrirEditar(a)}>Editar</button>
                  <button style={styles.btnExcluir} onClick={() => excluir(a.id)}>Excluir</button>
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
  formCard: { background: '#fff', borderRadius: 10, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 680 },
  formTitulo: { margin: '0 0 16px', color: '#1e3a5f' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  formBotoes: { gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 8 },
  busca: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
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
