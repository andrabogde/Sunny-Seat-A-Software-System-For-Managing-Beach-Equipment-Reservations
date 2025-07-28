import React from 'react';
import { Link } from 'react-router-dom';

const TermeniConditii = () => {
  return (
    <div className="termeni-conditii-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-5 text-center">
              <h1 className="fw-bold mb-4">Termeni și Condiții</h1>
              <p className="text-muted">Ultima actualizare: 11 mai 2025</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4 p-lg-5">
                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">1. Introducere</h2>
                  <p>
                    Bine ați venit pe platforma SunnySeat. Acești termeni și condiții guvernează utilizarea site-ului web SunnySeat, accesibil la adresa www.sunnyseat.ro și a tuturor serviciilor asociate.
                  </p>
                  <p>
                    Prin accesarea și utilizarea platformei noastre, sunteți de acord să respectați și să fiți obligat prin acești termeni. Dacă nu sunteți de acord cu orice parte a acestor termeni, vă rugăm să nu utilizați serviciile noastre.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">2. Definiții</h2>
                  <p>
                    <strong>"Platforma"</strong> se referă la site-ul web SunnySeat, aplicația mobilă și toate serviciile asociate.
                  </p>
                  <p>
                    <strong>"Utilizator"</strong> se referă la orice persoană care accesează sau utilizează Platforma, indiferent dacă este înregistrat sau nu.
                  </p>
                  <p>
                    <strong>"Cont"</strong> se referă la un cont înregistrat pe Platformă care permite accesul la funcționalitățile complete.
                  </p>
                  <p>
                    <strong>"Servicii"</strong> se referă la toate funcționalitățile oferite prin intermediul Platformei, inclusiv, dar fără a se limita la, rezervarea de șezlonguri și umbrele pe plajele din România.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">3. Utilizarea Serviciilor</h2>
                  <p>
                    <strong>3.1 Eligibilitate:</strong> Pentru a utiliza Serviciile noastre, trebuie să aveți cel puțin 18 ani sau vârsta legală din jurisdicția dumneavoastră pentru a încheia un contract obligatoriu.
                  </p>
                  <p>
                    <strong>3.2 Înregistrare:</strong> Pentru a beneficia de toate funcționalitățile Platformei, trebuie să vă creați un Cont. Sunteți responsabil pentru păstrarea confidențialității credențialelor contului și pentru toate activitățile care au loc sub contul dumneavoastră.
                  </p>
                  <p>
                    <strong>3.3 Utilizare acceptabilă:</strong> Sunteți de acord să utilizați Platforma doar în scopuri legale și în conformitate cu acești Termeni. Nu veți utiliza Platforma într-un mod care ar putea deteriora, dezactiva, supraîncărca sau compromite Platforma sau care ar putea interfera cu utilizarea și beneficiile altora.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">4. Rezervări și Plăți</h2>
                  <p>
                    <strong>4.1 Rezervări:</strong> Prin intermediul Platformei, puteți rezerva șezlonguri și umbrele la plajele partenere. Toate rezervările sunt supuse disponibilității și confirmării.
                  </p>
                  <p>
                    <strong>4.2 Plăți:</strong> Prețurile afișate includ TVA și toate taxele aplicabile. Plățile sunt procesate prin intermediul partenerilor noștri de plată.
                  </p>
                  <p>
                    <strong>4.3 Anulări și Rambursări:</strong> Politica de anulare și rambursare poate varia în funcție de plajă și de perioada rezervării. Detaliile specifice vor fi afișate în momentul efectuării rezervării.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">5. Proprietate Intelectuală</h2>
                  <p>
                    Platforma și tot conținutul său, caracteristicile și funcționalitățile sunt proprietatea SunnySeat sau a licențiatorilor săi. Aceste materiale sunt protejate de legi privind drepturile de autor, mărci comerciale, brevete și alte legi de proprietate intelectuală.
                  </p>
                  <p>
                    Nu aveți permisiunea să reproduceți, distribuiți, modificați, creați lucrări derivate, afișați public, executați public, republicați, descărcați, stocați sau transmiteți orice material de pe Platforma noastră, cu excepția cazului în care este permis în mod expres.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">6. Limitarea Răspunderii</h2>
                  <p>
                    <strong>6.1 Servicii furnizate "așa cum sunt":</strong> Platforma și toate serviciile sunt furnizate "așa cum sunt" și "după cum sunt disponibile" fără nicio garanție de niciun fel.
                  </p>
                  <p>
                    <strong>6.2 Limitarea răspunderii:</strong> În niciun caz SunnySeat nu va fi responsabil pentru daune directe, indirecte, incidentale, speciale, punitive sau consecvente care rezultă din utilizarea sau incapacitatea de a utiliza Serviciile.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">7. Modificări ale Termenilor</h2>
                  <p>
                    Ne rezervăm dreptul de a modifica acești Termeni în orice moment. Modificările intră în vigoare imediat după publicarea Termenilor actualizați pe Platformă. Utilizarea continuă a Platformei după astfel de modificări constituie acceptarea noilor Termeni.
                  </p>
                </section>

                <section className="mb-5">
                  <h2 className="h4 fw-bold mb-4">8. Legea Aplicabilă</h2>
                  <p>
                    Acești Termeni sunt guvernați și interpretați în conformitate cu legile din România, fără a ține cont de principiile conflictului de legi.
                  </p>
                </section>

                <section>
                  <h2 className="h4 fw-bold mb-4">9. Contact</h2>
                  <p>
                    Dacă aveți întrebări despre acești Termeni și Condiții, vă rugăm să ne contactați la:
                  </p>
                  <p className="mb-0">
                    <strong>Email:</strong> contact@sunnyseat.ro<br />
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
                <Link to="/politica-confidentialitate" className="btn btn-link text-decoration-none me-3">
                  Politica de Confidențialitate
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

export default TermeniConditii;