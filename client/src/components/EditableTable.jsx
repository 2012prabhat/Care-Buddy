import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSave, faCancel, faCheck, faXmark, faFileLines } from '@fortawesome/free-solid-svg-icons';


const EditableTable = ({
    headers,
    rows,
    editRowId,
    editedData,
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
    editableFields, // New prop for editable fields
    handleLog,
  }) => {
    return (
      <table className="table text-xs w-11/12" role="table">
        <thead className="tableHead">
          <tr>
            {headers?.map((header, index) => (
              <th className="p-1 text-left border" key={index}>
                {header.toUpperCase()}
              </th>
            ))}
            <th className="p-1 text-left border">ACTION</th>
          </tr>
        </thead>
          <tbody>
                 {rows.map((row) => (
                   <tr key={row.id}>
                     {headers.map((header) => (
                       <td
                         key={header}
                         style={{
                           padding: '12px',
                           border: '1px solid #ddd',
                           textAlign: 'left',
                         }}
                       >
                         {editRowId === row.id && editableFields.includes(header) ? (
                           header==='active'?<div className="cursor-pointer flex justify-center">
                                {/* <div>123 { String(editedData[header])}</div> */}
                           {editedData[header]==true && <FontAwesomeIcon onClick={(e) => handleChange(e, header,true)} value={true} color="var(--green_Main)" icon={faCheck}/>}
       
                           {editedData[header]==false && 
                               <FontAwesomeIcon onClick={(e) => handleChange(e, header,false)}  color="indianred" icon={faXmark}/>
                                  
                           
                          } 
                           </div> :
                           <input
                             type="text"
                             value={editedData[header] || ''}
                             onChange={(e) => handleChange(e, header)}
                             onKeyUp={(e) => e.key === 'Enter' && handleSave()}
                             style={{
                               width: '100%',
                               padding: '6px',
                               boxSizing: 'border-box',
                               border: '1px solid',
                               color: 'black',
                             }}
                           />
                         ) : (
                           row[header] === true ? (
                               <FontAwesomeIcon className="ml-2" color="var(--green_Main)" icon={faCheck} />
                             ) : row[header] === false ? (
                               <FontAwesomeIcon className="ml-2" color="indianred" icon={faXmark} />
                             ) : (
                               String(row[header])
                             )
                         )}
                       </td>
                     ))}
                     <td style={{ border: '1px solid #ddd' }}>
                       {editRowId === row.id ? (
                         <div className="flex justify-center">
                           <FontAwesomeIcon
                             className="p-2 cursor-pointer"
                             color="#67a97b"
                             onClick={handleSave}
                             icon={faSave}
                           />
                           <FontAwesomeIcon
                             className="p-2 cursor-pointer"
                             color="indianred"
                             onClick={handleCancel}
                             icon={faXmark}
                           />
                         </div>
                       ) : (
                         <div className="flex justify-center">
                           <FontAwesomeIcon
                             className="cursor-pointer"
                             onClick={() => handleEdit(row.id)}
                             icon={faPenToSquare}
                           />
                           <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={()=>handleLog(row.id)} icon={faFileLines} />
                         </div>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
      </table>
    );
  };
  
  export default EditableTable;
  