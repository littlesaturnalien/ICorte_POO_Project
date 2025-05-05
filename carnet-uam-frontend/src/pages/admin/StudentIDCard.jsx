// src/pages/admin/StudentIdCardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const API = 'http://localhost:8087/uam-carnet-sys';
const STATUS_OPTS = ['PENDING','APPROVED','REJECTED','DELIVERED','EMITTED'];

/* Paleta de colores personalizada */
const C = {
    tealLight: '#4da4ab',
    tealMid: '#487e84',
    tealDark: '#0b545b',
    black: '#2d2e3c'
};

/* helpers fecha */
const toISODate = d=>{
    if(!d) return '';
    const iso=d.match(/^\d{4}[-/]\d{2}[-/]\d{2}/);
    if(iso) return iso[0].replace(/\//g,'-');
    const dm=d.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
    return dm?`${dm[3]}-${dm[2]}-${dm[1]}`:'';
};
const b2iso=s=>s?`${s.slice(6,10)}-${s.slice(3,5)}-${s.slice(0,2)}T${s.slice(11)}`:'';
const iso2b=s=>s?`${s.slice(8,10)}-${s.slice(5,7)}-${s.slice(0,4)} ${s.slice(11)}`:'';

export default function StudentIdCardPage(){
    const { cif } = useParams();
    const [cards,setCards]=useState([]); const [reqs,setReqs]=useState([]);
    const [stu,setStu]=useState([]);    const [edit,setEdit]=useState({});
    const [open,setOpen]=useState(null);

    const load=async()=>{
        const [cRes,rRes,sRes]=await Promise.all([
            axios.get(`${API}/idcard`),
            axios.get(`${API}/requirement`),
            axios.get(`${API}/student`)
        ]);
        const c=cRes.data.filter(i=>i.cif===cif);
        const r=rRes.data.filter(i=>i.cif===cif);
        setCards(c); setReqs(r); setStu(sRes.data.filter(s=>s.cif===cif));

        const st={};
        c.forEach(cd=>{
            const req=r.find(q=>q.requirementId===cd.requirement_id);
            st[cd.idCardId]={
                status:cd.status,
                notes: cd.notes||'',
                issueDate: toISODate(cd.issueDate),
                deliveryAppointment: b2iso(cd.deliveryAppointment),
                pictureId: cd.picture_id,
                pictureUrl: cd.picture_url||'',
                photoAppointment: b2iso(cd.photoAppointment),
                requirementId: req?.requirementId,
                paymentProofUrl: req?.paymentProofUrl||'',
            };
        });
        setEdit(st);
    };
    useEffect(()=>{load();},[cif]);

    const keepOpen=i=>setOpen(i);

    const saveCard=async(cd,idx)=>{
        const e=edit[cd.idCardId];
        try{
            const dates={};
            if(e.issueDate && e.issueDate!==toISODate(cd.issueDate))
                dates.issueDate=e.issueDate;
            if(e.deliveryAppointment &&
                iso2b(e.deliveryAppointment)!==cd.deliveryAppointment)
                dates.deliveryAppointment=iso2b(e.deliveryAppointment);
            if(Object.keys(dates).length)
                await axios.patch(`${API}/idcard/${cd.idCardId}/dates`,dates);

            if(e.status!==cd.status)
                await axios.patch(`${API}/idcard/${cd.idCardId}/status`,{status:e.status});

            const note=(e.notes||'').trim();
            if(note && note!== (cd.notes||'').trim())
                await axios.patch(`${API}/idcard/${cd.idCardId}/addNotes`,{notes:note});

            alert('✅ Carnet actualizado');
            await load(); keepOpen(idx);
        }catch(err){console.error(err);alert('❌ Error al guardar carnet');}
    };

    const savePic = async (cd, idx) => {
        const e = edit[cd.idCardId];
        if (!e.requirementId) return alert('requirementId faltante');
        try {
            const reqRes = await axios.get(`${API}/requirement/${e.requirementId}`);
            const reqObj = reqRes.data.data ?? reqRes.data;
            const picId  = reqObj.pictureId;
            if (!picId) return alert('pictureId no encontrado en el requirement');

            await axios.put(`${API}/picture/${picId}`, {
                ...(e.photoAppointment && { photoAppointment: iso2b(e.photoAppointment) }),
                cif: cd.cif,
                photoUrl: e.pictureUrl
            });

            alert('✅ Foto guardada');
            await load(); keepOpen(idx);
        } catch (err) {
            console.error(err);
            alert('❌ Error al guardar foto');
        }
    };

    const saveReq=async(cd,idx)=>{
        const e=edit[cd.idCardId];
        if(!e.requirementId)return alert('requirementId faltante');
        try{
            await axios.put(`${API}/requirement/${e.requirementId}`,{
                paymentProofUrl:e.paymentProofUrl
            });
            alert('✅ Comprobante guardado'); await load(); keepOpen(idx);
        }catch(err){console.error(err);alert('❌ Error al guardar comprobante');}
    };

    const studentName=stu.length?`${stu[0].names} ${stu[0].surnames}`:'';

    return(
        <AdminLayout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Solicitudes de Carnet de {studentName}</h1>
                <Link to="/admin/students" className="text-[#0b545b] underline mb-6 block">
                    ← Volver a Estudiantes
                </Link>

                {!cards.length&&<p className="text-gray-500">No hay solicitudes.</p>}

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {cards.map((c,i)=>{
                        const e=edit[c.idCardId]||{};
                        return(
                            <div key={c.idCardId} className="border rounded-lg">
                                <button onClick={()=>setOpen(open===i?null:i)}
                                        className="w-full p-4 bg-gray-100 flex justify-between">
                                    <span className="font-semibold">
                                        Semestre {c.semester} {c.year} — {c.status}
                                    </span>
                                    <span>{open===i?'−':'+'}</span>
                                </button>

                                {open===i&&(
                                    <div className="p-4 space-y-5 bg-white rounded-b-lg">
                                        {/* carnet */}
                                        <section className="space-y-2">
                                            <h2 className="text-lg font-medium">Carnet</h2>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">Estado</label>
                                                <select value={e.status}
                                                        onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,status:ev.target.value}})}
                                                        className="border px-2 py-1 rounded">
                                                    {STATUS_OPTS.map(s=><option key={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">Emisión</label>
                                                <input type="date" className="border px-2 py-1 rounded"
                                                       value={e.issueDate}
                                                       onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,issueDate:ev.target.value}})}/>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">Entrega</label>
                                                <input type="datetime-local" className="border px-2 py-1 rounded"
                                                       value={e.deliveryAppointment}
                                                       onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,deliveryAppointment:ev.target.value}})}/>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <label className="w-44 font-semibold mt-1">Notas</label>
                                                <textarea rows={3} className="border px-2 py-1 rounded w-full"
                                                          value={e.notes}
                                                          onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,notes:ev.target.value}})}/>
                                            </div>
                                            <button onClick={()=>saveCard(c,i)}
                                                    className="text-white px-3 py-1 rounded"
                                                    style={{ backgroundColor: C.tealMid }}>
                                                Guardar Carnet
                                            </button>
                                        </section>

                                        {/* foto */}
                                        <section className="space-y-2 pt-4 border-t">
                                            <h2 className="text-lg font-medium">Fotografía</h2>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">URL</label>
                                                <input type="url" className="border px-2 py-1 rounded w-full"
                                                       value={e.pictureUrl}
                                                       onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,pictureUrl:ev.target.value}})}/>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">Cita Foto</label>
                                                <input type="datetime-local" className="border px-2 py-1 rounded"
                                                       value={e.photoAppointment}
                                                       onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,photoAppointment:ev.target.value}})}/>
                                            </div>
                                            <button onClick={()=>savePic(c,i)}
                                                    className="text-white px-3 py-1 rounded"
                                                    style={{ backgroundColor: C.tealLight }}>
                                                Guardar Foto
                                            </button>
                                            {e.pictureUrl&&(
                                                <p className="mt-1">
                                                    <a href={e.pictureUrl} target="_blank" rel="noreferrer"
                                                       className="text-[#0b545b] underline">Ver foto actual</a>
                                                </p>
                                            )}
                                        </section>

                                        {/* comprobante */}
                                        <section className="space-y-2 pt-4 border-t">
                                            <h2 className="text-lg font-medium">Comprobante de Pago</h2>
                                            <div className="flex gap-2 items-center">
                                                <label className="w-44 font-semibold">URL</label>
                                                <input type="url" className="border px-2 py-1 rounded w-full"
                                                       value={e.paymentProofUrl}
                                                       onChange={ev=>setEdit({...edit,[c.idCardId]:{...e,paymentProofUrl:ev.target.value}})}/>
                                            </div>
                                            <button onClick={()=>saveReq(c,i)}
                                                    className="text-white px-3 py-1 rounded"
                                                    style={{ backgroundColor: C.tealDark }}>
                                                Guardar Comprobante
                                            </button>
                                            {e.paymentProofUrl&&(
                                                <p className="mt-1">
                                                    <a href={e.paymentProofUrl} target="_blank" rel="noreferrer"
                                                       className="text-[#0b545b] underline">Ver comprobante actual</a>
                                                </p>
                                            )}
                                        </section>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
