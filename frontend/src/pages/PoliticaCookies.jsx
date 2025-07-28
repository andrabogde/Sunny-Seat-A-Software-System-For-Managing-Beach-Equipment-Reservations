import React from 'react';
import { Link } from 'react-router-dom';

const PoliticaCookies = () => {
  return (
    <div className="politica-cookies-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-5 text-center">
              <h1 className="fw-bold mb-4">Politica de Cookies</h1>
              <p className="text-muted">Ultima actualizare: 11 mai 2025</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4 p-lg-5">
                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">1. Ce sunt cookie-urile?</h2>
                  <p>
                    Cookie-urile sunt fișiere text mici care sunt stocate pe dispozitivul dvs. (computer, tabletă, telefon mobil) atunci când vizitați un site web. Acestea sunt utilizate pe scară largă pentru a face site-urile web să funcționeze sau să funcționeze mai eficient, precum și pentru a furniza informații proprietarilor site-ului.
                  </p>
                  <p>
                    Cookie-urile pot fi "persistente" sau "de sesiune". Cookie-urile persistente rămân pe dispozitivul dvs. personal atunci când ieșiți din browser și până când expiră sau până când le ștergeți. Cookie-urile de sesiune sunt șterse imediat ce închideți browserul.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">2. Cum folosim cookie-urile</h2>
                  <p>
                    Utilizăm cookie-uri pe platforma SunnySeat pentru următoarele scopuri:
                  </p>

                  <div className="mb-4">
                    <h5 className="fw-bold">Cookie-uri esențiale</h5>
                    <p>
                      Aceste cookie-uri sunt necesare pentru ca site-ul nostru să funcționeze și nu pot fi dezactivate în sistemele noastre. Ele sunt de obicei setate doar ca răspuns la acțiunile făcute de dvs. care echivalează cu o cerere de servicii, cum ar fi setarea preferințelor de confidențialitate, autentificarea sau completarea formularelor. Puteți să vă configurați browserul să blocheze aceste cookie-uri, dar unele părți ale site-ului nostru nu vor funcționa.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold">Cookie-uri de performanță</h5>
                    <p>
                      Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic pentru a putea măsura și îmbunătăți performanța site-ului nostru. Ele ne ajută să știm care pagini sunt cele mai populare și care sunt mai puțin populare și să vedem cum vizitatorii se deplasează în jurul site-ului. Toate informațiile pe care aceste cookie-uri le colectează sunt agregate și, prin urmare, anonime. Dacă nu permiteți aceste cookie-uri, nu vom ști când ați vizitat site-ul nostru.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold">Cookie-uri de funcționalitate</h5>
                    <p>
                      Aceste cookie-uri permit site-ului să ofere funcționalități și personalizare îmbunătățite. Ele pot fi setate de noi sau de furnizori terți ale căror servicii le-am adăugat la paginile noastre. Dacă nu permiteți aceste cookie-uri, unele sau toate aceste servicii pot să nu funcționeze corect.
                    </p>
                  </div>

                  <div>
                    <h5 className="fw-bold">Cookie-uri de marketing</h5>
                    <p>
                      Aceste cookie-uri pot fi setate prin site-ul nostru de partenerii noștri de publicitate. Ele pot fi folosite de aceste companii pentru a construi un profil al intereselor dvs. și pentru a vă arăta reclame relevante pe alte site-uri. Ele nu stochează direct informații personale, ci se bazează pe identificarea unică a browserului și a dispozitivului dvs. de internet. Dacă nu permiteți aceste cookie-uri, veți experimenta publicitate mai puțin direcționată.
                    </p>
                  </div>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">3. Tipuri specifice de cookie-uri pe care le folosim</h2>
                  <div className="table-responsive mb-4">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Nume cookie</th>
                          <th>Scop</th>
                          <th>Durata de viață</th>
                          <th>Tip</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>session_id</td>
                          <td>Folosit pentru a menține sesiunea utilizatorului</td>
                          <td>Sesiune</td>
                          <td>Esențial</td>
                        </tr>
                        <tr>
                          <td>user_auth</td>
                          <td>Folosit pentru autentificarea utilizatorului</td>
                          <td>30 zile</td>
                          <td>Esențial</td>
                        </tr>
                        <tr>
                          <td>language</td>
                          <td>Stochează preferințele de limbă</td>
                          <td>1 an</td>
                          <td>Funcționalitate</td>
                        </tr>
                        <tr>
                          <td>_ga</td>
                          <td>Folosit de Google Analytics pentru a distinge utilizatorii</td>
                          <td>2 ani</td>
                          <td>Performanță</td>
                        </tr>
                        <tr>
                          <td>_gid</td>
                          <td>Folosit de Google Analytics pentru a distinge utilizatorii</td>
                          <td>24 ore</td>
                          <td>Performanță</td>
                        </tr>
                        <tr>
                          <td>_fbp</td>
                          <td>Folosit de Facebook pentru a oferi o serie de produse publicitare</td>
                          <td>3 luni</td>
                          <td>Marketing</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    Această listă nu este exhaustivă și poate fi actualizată pe măsură ce platforma noastră evoluează sau pe măsură ce schimbăm furnizorii de servicii.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">4. Cum să gestionați cookie-urile</h2>
                  <p>
                    Majoritatea browserelor web vă permit să controlați cookie-urile prin setările de preferințe. Cu toate acestea, dacă restricționați cookie-urile, este posibil să nu puteți utiliza toate funcționalitățile platformei noastre.
                  </p>
                  <p>
                    Puteți șterge cookie-urile stocate pe computerul dvs. în orice moment. Iată cum puteți gestiona cookie-urile în principalele browsere:
                  </p>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card h-100 p-3 border-0 bg-light rounded-3">
                        <div className="card-body">
                          <h5 className="fw-bold">Google Chrome</h5>
                          <p>
                            Accesați Meniu → Setări → Afișați setări avansate → Confidențialitate → Setări conținut → Cookie-uri
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100 p-3 border-0 bg-light rounded-3">
                        <div className="card-body">
                          <h5 className="fw-bold">Mozilla Firefox</h5>
                          <p>
                            Accesați Meniu → Opțiuni → Confidențialitate → Istoric → Utilizare setări personalizate pentru istoric
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100 p-3 border-0 bg-light rounded-3">
                        <div className="card-body">
                          <h5 className="fw-bold">Microsoft Edge</h5>
                          <p>
                            Accesați Meniu → Setări → Cookie-uri și permisiuni site → Gestionare și ștergere cookie-uri și date site
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100 p-3 border-0 bg-light rounded-3">
                        <div className="card-body">
                          <h5 className="fw-bold">Safari</h5>
                          <p>
                            Accesați Preferințe → Confidențialitate → Cookie-uri și date site web
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p>
                    Pentru informații mai detaliate despre cum să gestionați cookie-urile, vă rugăm să consultați documentația browserului dvs. sau să vizitați <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
                  </p>
                </section>
                
                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">5. Cookie-uri ale terților</h2>
                  <p>
                    Pe lângă cookie-urile setate direct de noi, site-ul nostru poate conține și cookie-uri ale terților care sunt instalate de servicii externe pe care le folosim pentru a îmbunătăți experiența dvs. Acestea includ:
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <strong>Google Analytics</strong> - Utilizăm Google Analytics pentru a analiza modul în care utilizatorii folosesc site-ul nostru.
                    </li>
                    <li className="mb-3">
                      <strong>Facebook Pixel</strong> - Utilizăm Facebook Pixel pentru a măsura eficacitatea publicității noastre și pentru a înțelege acțiunile pe care le efectuați pe site-ul nostru.
                    </li>
                    <li>
                      <strong>Alte servicii de analiză și marketing</strong> - Putem utiliza și alte servicii pentru a ne ajuta să înțelegem cum este folosit site-ul nostru și pentru a optimiza experiența utilizatorilor.
                    </li>
                  </ul>
                </section>
                
                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">6. Modificări ale politicii de cookie-uri</h2>
                  <p>
                    Ne rezervăm dreptul de a modifica această politică de cookie-uri în orice moment. Orice modificări vor fi publicate pe această pagină. Vă încurajăm să revizuiți periodic această politică pentru a fi informat despre modul în care protejăm informațiile pe care le colectăm.
                  </p>
                  <p>
                    Data ultimei actualizări este menționată la începutul acestei politici.
                  </p>
                </section>
                
                <section>
                  <h2 className="h4 fw-bold mb-4">7. Contactați-ne</h2>
                  <p>
                    Dacă aveți întrebări sau nelămuriri cu privire la politica noastră de cookie-uri, vă rugăm să ne contactați la:
                  </p>
                  <div className="card p-4 bg-light border-0 rounded-4">
                    <p className="mb-2"><strong>SunnySeat SRL</strong></p>
                    <p className="mb-2">Email: contact@SunnySeat.ro</p>
                    <p className="mb-2">Telefon: +40 721 234 567</p>
                    <p className="mb-0">Adresă: Strada Exemplu nr. 123, Constanța, România</p>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/" className="btn btn-primary rounded-pill px-4 py-2">
                Înapoi la pagina principală
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;