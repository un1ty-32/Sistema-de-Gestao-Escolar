import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Notas() {
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [turmaId, setTurmaId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [boletim, setBoletim] = useState([]);
  const [form, setForm] = useState({ aluno_id: '', disciplina_id: '', bimestre: '1', tipo: 'prova', valor: '' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    api.get('/turmas').then(r => setTurmas(r.data));
  }, []);

  useEffect(() => {
    if (!turmaId) { setAlunos([]); setDisciplinas([]); return; }
    api.get(`/alunos/turma/${turmaId}`).then(r => setAlunos(r.data));
    // Busca disciplinas da turma via lista geral (simplificado)
    setDisciplinas([
      { id: 1, nome: 'Matemática' },
      { id: 2, nome: 'Português' },
      { id: 3, nome: 'Ciências' },
      { id: 4, nome: 'História' },
      { id: 5, nome: 'Geografia' },
    ]);
  }, [turmaId]);

  useEffect(() => {
    if (!alunoId) { setBoletim([]); return; }
    api.get(`/notas/aluno/${alunoId}`).then(r => setBoletim(r.data));
  }, [alunoId]);

  async function lancarNota(e) {
    e.preventDefault();
    setErro('');
    if (Number(form.valor) < 0 || Number(form.valor) > 10) {
      return setErro('A nota deve ser entre 0 e 10.');
    }
    try {
      await api.post('/notas', { ...form, aluno_id: alunoId || form.aluno_id });
      setSucesso('Nota lançada com sucesso!');
      setMostrarForm(false);
      if (alunoId) api.get(`/notas/aluno/${alunoId}`).then(r => setBoletim(r.data));
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao lançar nota.');
    }
  }

  // Agrupa boletim por disciplina
  const porDisciplina = boletim.reduce((acc, n) => {
    if (!acc[n.disciplina_nome]) acc[n.disciplina_nome] = [];
    acc[n.disciplina_nome].push(n);
    return acc;
  }, {});

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>📝 Notas</h2>
        <button style={styles.btnPrimario} onClick={() => { setMostrarForm(true); setErro(''); }}>+ Lançar Nota</button>
      </div>

      {sucesso && <div style={styles.sucesso}>{sucesso}</div>}

      {mostrarForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitulo}>Lançar Nota</h3>
          {erro && <div style={styles.erro}>{erro}</div>}
          <form onSubmit={lancarNota} style={styles.form}>
            <Campo label="Turma" required>
              <select style={styles.input} value={turmaId} onChange={e => setTurmaId(e.target.value)} required>
                <option value="">-- Selecionar --</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </Campo>
            <Campo label="Aluno" required>
              <select style={styles.input} value={form.aluno_id} onChange={e => setForm({ ...form, aluno_id: e.target.value })} required>
                <option value="">-- Selecionar --</option>
                {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </Campo>
            <Campo label="Disciplina" required>
              <select style={styles.input} value={form.disciplina_id} onChange={e => setForm({ ...form, disciplina_id: e.target.value })} required>
                <option value="">-- Selecionar --</option>
                {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </Campo>
            <Campo label="Bimestre" required>
              <select style={styles.input} value={form.bimestre} onChange={e => setForm({ ...form, bimestre: e.target.value })}>
                {[1,2,3,4].map(b => <option key={b} value={b}>{b}º Bimestre</option>)}
              </select>
            </Campo>
            <Campo label="Tipo" required>
              <select style={styles.input} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                <option value="prova">Prova</option>
                <option value="trabalho">Trabalho</option>
                <option value="atividade">Atividade</option>
              </select>
            </Campo>
            <Campo label="Valor (0 a 10)" required>
              <input style={styles.input} type="number" step="0.1" min="0" max="10"
                value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required />
            </Campo>
            <div style={styles.formBotoes}>
              <button type="submit" style={styles.btnPrimario}>Salvar</button>
              <button type="button" style={styles.btnSecundario} onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.consultaCard}>
        <h3 style={styles.formTitulo}>📋 Consultar Boletim</h3>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={styles.label}>Turma</label>
            <select style={styles.input} value={turmaId} onChange={e => { setTurmaId(e.target.value); setAlunoId(''); setBoletim([]); }}>
              <option value="">-- Selecionar turma --</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={styles.label}>Aluno</label>
            <select style={styles.input} value={alunoId} onChange={e => setAlunoId(e.target.value)} disabled={!turmaId}>
              <option value="">-- Selecionar aluno --</option>
              {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
        </div>

        {alunoId && Object.keys(porDisciplina).length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Nenhuma nota lançada para este aluno.</p>
        )}

        {Object.entries(porDisciplina).map(([disc, notas]) => {
          const media = (notas.reduce((s, n) => s + Number(n.valor), 0) / notas.length).toFixed(1);
          const aprovado = Number(media) >= 5;
          return (
            <div key={disc} style={styles.disciplinaCard}>
              <div style={styles.discHeader}>
                <strong>{disc}</strong>
<span
  style={{
    ...styles.badge,
    background: aprovado ? '#d1fae5' : '#fee2e2',
    color: aprovado ? '#065f46' : '#dc2626'
  }}
>'#fee2e2', color: aprovado ? '#065f46' : '#dc2626' }}>
                  Média: {media} — {aprovado ? '✅ Aprovado' : '⚠️ Em risco'}
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={styles.th2}>Bimestre</th>
                    <th style={styles.th2}>Tipo</th>
                    <th style={styles.th2}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map(n => (
                    <tr key={n.id}>
                      <td style={styles.td2}>{n.bimestre}º</td>
                      <td style={styles.td2}>{n.tipo}</td>
                      <td style={styles.td2}><strong>{Number(n.valor).toFixed(1)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
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
  consultaCard: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  formTitulo: { margin: '0 0 16px', color: '#1e3a5f' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#374151' },
  formBotoes: { gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 8 },
  btnPrimario: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  btnSecundario: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  disciplinaCard: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, marginBottom: 12 },
  discHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: 12, padding: '3px 10px', borderRadius: 20 },
  th2: { padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600 },
  td2: { padding: '7px 12px', fontSize: 13, color: '#374151', borderTop: '1px solid #f1f5f9' },
};
