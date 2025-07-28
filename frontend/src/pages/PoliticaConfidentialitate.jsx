import React from 'react';
import { Link } from 'react-router-dom';

const PoliticaConfidentialitate = () => {
  return (
    <div className="politica-confidentialitate-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-5 text-center">
              <h1 className="fw-bold mb-4">Politica de Confidențialitate</h1>
              <p className="text-muted">Ultima actualizare: 11 mai 2025</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4 p-lg-5">
                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">1. Introducere</h2>
                  <p>
                    SunnySeat respectă confidențialitatea datelor dumneavoastră personale și se angajează să le protejeze. Această Politică de Confidențialitate explică cum colectăm, utilizăm și protejăm informațiile pe care le furnizați atunci când utilizați platforma noastră.
                  </p>
                  <p>
                    Prin utilizarea platformei SunnySeat, sunteți de acord cu practicile descrise în această Politică de Confidențialitate. Dacă nu sunteți de acord cu această politică, vă rugăm să nu utilizați site-ul nostru.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">2. Informațiile pe care le colectăm</h2>
                  <p>
                    <strong>2.1 Informații personale:</strong> Putem colecta următoarele tipuri de informații personale:
                  </p>
                  <ul className="mb-4">
                    <li>Nume și prenume</li>
                    <li>Adresă de email</li>
                    <li>Număr de telefon</li>
                    <li>Adresa de facturare și/sau livrare</li>
                    <li>Informații despre plată (fără a stoca detalii complete ale cardului)</li>
                    <li>Preferințele dumneavoastră legate de plaje și șezlonguri</li>
                  </ul>
                  <p>
                    <strong>2.2 Informații de utilizare:</strong> Colectăm automat anumite informații atunci când vizitați, utilizați sau navigați pe platforma noastră. Aceste informații pot include:
                  </p>
                  <ul>
                    <li>Adresa IP</li>
                    <li>Tipul și versiunea browserului</li>
                    <li>Tipul și modelul dispozitivului</li>
                    <li>Sistemul de operare</li>
                    <li>Datele log despre sesiunea dumneavoastră</li>
                    <li>Paginile vizitate și modul în care interacționați cu platforma</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">3. Cum utilizăm informațiile dumneavoastră</h2>
                  <p>
                    Utilizăm informațiile pe care le colectăm pentru următoarele scopuri:
                  </p>
                  <ul className="mb-4">
                    <li>Pentru a vă oferi și menține serviciile noastre</li>
                    <li>Pentru a procesa și finaliza rezervările dumneavoastră</li>
                    <li>Pentru a vă furniza asistență și a răspunde la întrebările dumneavoastră</li>
                    <li>Pentru a vă trimite informații despre serviciile noastre, ofertele speciale sau actualizările platformei (doar cu acordul dumneavoastră)</li>
                    <li>Pentru a îmbunătăți platforma noastră și a înțelege cum utilizatorii interacționează cu aceasta</li>
                    <li>Pentru a detecta, preveni și aborda probleme tehnice sau de securitate</li>
                    <li>Pentru a respecta obligațiile legale</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">4. Partajarea informațiilor dumneavoastră</h2>
                  <p>
                    Nu vindem, comercializăm sau transferăm informațiile dumneavoastră personale către terți fără acordul dumneavoastră, cu următoarele excepții:
                  </p>
                  <ul className="mb-4">
                    <li>
                      <strong>Parteneri de plaje:</strong> Partajăm informațiile necesare (nume, detalii de contact, detalii despre rezervare) cu plajele partenere pentru a facilita și confirma rezervările dumneavoastră.
                    </li>
                    <li>
                      <strong>Procesatori de plăți:</strong> Utilizăm servicii terțe pentru procesarea plăților. Acești procesatori vor avea acces la informațiile necesare pentru a procesa plățile.
                    </li>
                    <li>
                      <strong>Furnizori de servicii:</strong> Putem partaja informații cu furnizori de servicii care ne ajută să ne desfășurăm activitatea (ex: analiză web, servicii de email, găzduire).
                    </li>
                    <li>
                      <strong>Obligații legale:</strong> Putem divulga informațiile dumneavoastră dacă suntem obligați prin lege sau în cazul în care credem că o astfel de acțiune este necesară pentru a respecta legea sau pentru a proteja drepturile, proprietatea sau siguranța noastră, a utilizatorilor noștri sau a altora.
                    </li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">5. Securitatea datelor</h2>
                  <p>
                    Implementăm măsuri de securitate adecvate pentru a proteja informațiile personale împotriva accesului neautorizat, alterării, divulgării sau distrugerii. Aceste măsuri includ criptarea datelor sensibile, protocoale de acces securizate și revizuiri periodice ale politicilor de securitate.
                  </p>
                  <p>
                    Cu toate acestea, trebuie să înțelegeți că nicio metodă de transmisie pe internet sau metodă de stocare electronică nu este 100% sigură și nu putem garanta securitatea absolută a datelor dumneavoastră.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">6. Drepturile dumneavoastră privind datele</h2>
                  <p>
                    În conformitate cu Regulamentul General privind Protecția Datelor (GDPR) și alte legi aplicabile privind protecția datelor, aveți următoarele drepturi:
                  </p>
                  <ul className="mb-4">
                    <li>Dreptul de a fi informat despre colectarea și utilizarea datelor personale</li>
                    <li>Dreptul de acces la datele personale pe care le deținem despre dumneavoastră</li>
                    <li>Dreptul la rectificarea datelor inexacte sau incomplete</li>
                    <li>Dreptul la ștergerea datelor personale ("dreptul de a fi uitat")</li>
                    <li>Dreptul la restricționarea procesării datelor dumneavoastră</li>
                    <li>Dreptul la portabilitatea datelor</li>
                    <li>Dreptul de a obiecta la procesarea datelor dumneavoastră</li>
                    <li>Drepturi legate de luarea automată a deciziilor și profilare</li>
                  </ul>
                  <p>
                    Pentru a vă exercita oricare dintre aceste drepturi, vă rugăm să ne contactați folosind detaliile de la sfârșitul acestei politici.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">7. Perioada de păstrare a datelor</h2>
                  <p>
                    Vom păstra datele dumneavoastră personale doar atât timp cât este necesar pentru scopurile stabilite în această Politică de Confidențialitate sau cât timp suntem obligați prin lege. După această perioadă, datele dumneavoastră vor fi șterse sau anonimizate.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">8. Linkuri către alte site-uri</h2>
                  <p>
                    Platforma noastră poate conține linkuri către alte site-uri web care nu sunt operate de noi. Dacă faceți clic pe un link terț, veți fi direcționat către site-ul respectivului terț. Vă recomandăm insistent să revizuiți Politica de Confidențialitate a fiecărui site pe care îl vizitați.
                  </p>
                  <p>
                    Nu avem control asupra și nu ne asumăm responsabilitatea pentru conținutul, politicile de confidențialitate sau practicile oricăror site-uri sau servicii terțe.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">9. Modificări ale Politicii de Confidențialitate</h2>
                  <p>
                    Putem actualiza Politica noastră de Confidențialitate din când în când. Vom notifica orice modificări prin postarea noii Politici de Confidențialitate pe această pagină și vom actualiza data "Ultima actualizare" din partea de sus.
                  </p>
                  <p>
                    Vă încurajăm să revizuiți periodic această Politică de Confidențialitate pentru a fi informat despre cum vă protejăm informațiile.
                  </p>
                </section>

                <section>
                  <h2 className="h4 fw-bold mb-4">10. Contact</h2>
                  <p>
                    Dacă aveți întrebări sau preocupări despre această Politică de Confidențialitate sau despre datele dumneavoastră, vă rugăm să ne contactați la:
                  </p>
                  <p className="mb-0">
                    <strong>Email:</strong> contact@SunnySeat.ro<br />
                    <strong>Telefon:</strong> +40 755 123 456<br />
                    <strong>Adresă:</strong> Strada Exemplu, Nr. 123, București, România
                  </p>
                </section>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <Link to="/" className="btn btn-outline-primary rounded-pill px-4">
                Înapoi la Pagina Principală
              </Link>
              <div>
                <Link to="/termeni-conditii" className="btn btn-link text-decoration-none me-3">
                  Termeni și Condiții
                </Link>
                <Link to="/politica-cookies" className="btn btn-link text-decoration-none">
                  Politica de Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaConfidentialitate;