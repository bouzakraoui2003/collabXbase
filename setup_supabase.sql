-- Enable Row Level Security (RLS) is automatically enabled on creating tables in newer Supabase, but we declare it explicitly.

-- 1. Create 'influencers' table
create table public.influencers (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  handle text not null,
  followers text not null,
  image text not null,
  niche text not null,
  gender text not null,
  is_hidden boolean not null default false,
  constraint influencers_pkey primary key (id)
);

-- 2. Create 'brands' table
create table public.brands (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  handle text not null,
  image text not null,
  is_hidden boolean not null default false,
  constraint brands_pkey primary key (id)
);

-- 3. Enable RLS
alter table public.influencers enable row level security;
alter table public.brands enable row level security;

-- 4. Create Policies

-- Allow public read access to all data (or only visible, but for now let's allow all so admin can see hidden ones easily, or we filter in frontend)
-- Actually, strict security: Public sees only is_hidden = false. Admin (authenticated) sees all.
create policy "Public can view visible influencers"
  on public.influencers
  for select
  to public
  using (is_hidden = false);

create policy "Admins can view all influencers"
  on public.influencers
  for select
  to authenticated
  using (true);

create policy "Admins can insert influencers"
  on public.influencers
  for insert
  to authenticated
  with check (true);

create policy "Admins can update influencers"
  on public.influencers
  for update
  to authenticated
  using (true);

create policy "Admins can delete influencers"
  on public.influencers
  for delete
  to authenticated
  using (true);

-- Same for Brands
create policy "Public can view visible brands"
  on public.brands
  for select
  to public
  using (is_hidden = false);

create policy "Admins can view all brands"
  on public.brands
  for select
  to authenticated
  using (true);

create policy "Admins can insert brands"
  on public.brands
  for insert
  to authenticated
  with check (true);

create policy "Admins can update brands"
  on public.brands
  for update
  to authenticated
  using (true);

create policy "Admins can delete brands"
  on public.brands
  for delete
  to authenticated
  using (true);

-- 5. Storage (Optional for now, but good to have)
-- You can set this up in the UI: Storage -> New Bucket -> "collabx-assets", Public.
-- OR attempt to create via SQL (experimental/extension dependent), usually better to just insert into storage.buckets if using standard Supabase schemas.
-- This part assumes standard storage schema. If this fails, user must create bucket manually.

INSERT INTO storage.buckets (id, name, public) VALUES ('collabx-assets', 'collabx-assets', true) ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'collabx-assets' );
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'collabx-assets' );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'collabx-assets' );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'collabx-assets' );

-- 6. Seed Data (Example)
-- Run the following separate INSERT commands to populate your data.
-- (Note: I have generated these from your existing files)

INSERT INTO public.brands (name, handle, image) VALUES
('Valary Skin', 'valaryskin.ma', 'influncers images/valary.jpg'),
('LC Waikiki', 'lcwaikiki.morocco', 'influncers images/lc_waikiki.png'),
('King Tacos', 'kingtacos_maarif', 'influncers images/king tacos.jpg'),
('Bo Sushi', 'bosushi_casablanca', 'influncers images/bo sushi.jpg'),
('Huawei', 'huaweimobilemaroc', 'influncers images/huawei.png'),
('Mira Clinic', 'miraclinic.tr', 'influncers images/mira clenic.jpg'),
('Health Power', 'healthpower_officiel', 'influncers images/health power.jpg'),
('Muzz', 'muzz_maghreb', 'influncers images/muzz.jpg'),
('Xiaomi', 'xiaomi.morocco', 'influncers images/redmi.jpg'),
('Honor', 'honormorocco', 'influncers images/honor.jpg'),
('Franui', 'franui.ma', 'influncers images/franui.png'),
('Derma Doc', 'dermadocmaroc', 'influncers images/derma doc.png'),
('Hadri Parfums', 'hadriparfums', 'influncers images/hadri.jpg'),
('Maroc Skydive', 'maroc.skydive', 'influncers images/maroc skydive.png'),
('Numero Arabia', 'numeroarabia', 'influncers images/numero arabia.jpg'),
('Clay Oven', 'clay.oven', 'influncers images/clay oven.jpg'),
('Palméa', 'palmeastore1', 'https://image2url.com/r2/default/images/1767447023846-c06b3212-8500-4ddc-9db8-21be5fa99638.jpg'),
('Intoura', 'intoura.ma', 'https://image2url.com/r2/default/images/1767447311590-62ec67d6-93db-4339-b600-141a4a2940ca.jpg');

INSERT INTO public.influencers (name, handle, followers, image, niche, gender) VALUES
('HBIRKOUSAFAE OFFICIEL', 'hbirkousafae_officiel', '7.4M', 'influncers images/hbirkou safae.jpg', 'Actress/Lifestyle', 'F'),
('FATIJAMALIOFFICIEL', 'fatijamaliofficiel', '5.6M', 'influncers images/Fati Jamali.jpg', 'Artist/Model', 'F'),
('NOUHAILA BARBIE', 'nouhaila_barbie', '4.1M', 'influncers images/nouhaila barbie .jpg', 'Beauty/Lifestyle', 'F'),
('ZOUHAIRZAIR', 'zouhairzair', '3.3M', 'influncers images/zouhair zair.jpeg', 'Humor/Comedy', 'M'),
('ASMAE AMRANI', 'asmaeamraniofficiel', '3.3M', 'influncers images/asmae amrani.jpg', 'Fashion/Lifestyle', 'F'),
('FATIMAZAHRAQANBOUA_', 'fatimazahraqanboua_', '3.2M', 'influncers images/FatimaZahra Qanboua.jpg', 'Actress/Lifestyle', 'F'),
('ABOUBAKR ZIANI', 'aboubakrziani', '3M', 'influncers images/aboubakr ziani.jpg', 'Lifestyle/Vlog', 'M'),
('NOUREDDINE ABAS DAKI', 'noureddine.abas.daki', '2.6M', 'influncers images/noureddine abas daki.webp', 'Lifestyle/Fitness', 'M'),
('SAHARSEDDIKI', 'saharseddiki', '2.5M', 'influncers images/sahar seddiki.png', 'Artist/Singer', 'F'),
('AMINEES SALHI', 'aminees_salhi', '2.3M', 'influncers images/aminees salhi.jpg', 'Lifestyle/Travel', 'M'),
('FATIMA ZAHRA_EL_IBRAHIMI', 'fatima_zahra_el_ibrahimi', '2.3M', 'influncers images/fatima zahra el ibrahimi.jpg', 'Lifestyle/Family', 'F'),
('ABDELILLAH HABBAT IDRISSI', 'habbatabdelillah', '2.2M', 'influncers images/abdel illah habbat idrissi.jpg', 'Lifestyle/Fitness', 'M'),
('CHEKORS', 'chekorsfamily', '2.1M', 'influncers images/chekors.jpg', 'Family/Vlog', 'M'),
('ANASELHAMDOUCHII', 'anaselhamdouchii', '2M', 'influncers images/anas elhamdouchi.jpg', 'Lifestyle', 'M'),
('YOUSRA BARRYCH', 'yousraqueenofmysel', '2M', 'influncers images/Yousra Barrych.png', 'Lifestyle', 'F'),
('SOSSAM', 'sossamofficiel', '1.9M', 'influncers images/sossam.jpg', 'Humor/Pranks', 'M'),
('MERIEM.ZOUBIR', 'meriem.zoubir', '1.8M', 'influncers images/meryem zoubir.jpg', 'Lifestyle', 'F'),
('SANAESLAAAY', 'sanaeslaaay', '1.6M', 'influncers images/sanae slaaay.jpg', 'Lifestyle', 'F'),
('SEDKIHOUDA_OFFICIEL', 'sedkihouda_officiel', '1.4M', 'influncers images/houda sedki.jpg', 'Actress/Lifestyle', 'F'),
('KHAWLA GHARRAFI CHERKAOUI', 'khawlaqueenofficial', '1.4M', 'influncers images/KHAWLA GHARRAFI CHERKAOUI.jpg', 'Lifestyle', 'F'),
('HAJAR ADNANE OFFICIEL', 'hajar_adnane_officiel', '1.3M', 'influncers images/HAJAR ADNANE OFFICIEL.jpg', 'Artist/Singer', 'F'),
('SALWAZARHANE', 'salwazarhane', '1.2M', 'influncers images/SALWAZARHANE.jpeg', 'Actress', 'F'),
('NADA.HADDAOUI', 'nada.haddaoui', '1.1M', 'influncers images/NADA.HADDAOUI.jpg', 'Lifestyle', 'F'),
('RITALAGZOULI', 'ritalagzouli', '1.1M', 'influncers images/RITALAGZOULI.jpg', 'Lifestyle', 'F'),
('DR ISMAEL AZIZ', 'dr.ismael2', '1M', 'influncers images/dr ismael aziz.jpg', 'Health/Doctor', 'M'),
('EL MEHDI BOUGHABA', 'mehdi_boughaba1', '1M', 'influncers images/Mehdi boughaba.jpg', 'Lifestyle', 'M'),
('SOUKAINA GLAMOUR', 'glamour_by_soukaina', '1M', 'influncers images/soukaina glamour.jpeg', 'Beauty/Lifestyle', 'F'),
('SELMA FAIDA', 'selma.feida', '1M', 'influncers images/SELMA FAIDA.jpeg', 'Lifestyle', 'F'),
('KENZA BELLA', 'kenza_bella_officiel', '1M', 'influncers images/KENZA BELLA.jpg', 'Lifestyle', 'F'),
('AYOUB STAR', 'ayoub.star.officiel', '1M', 'influncers images/AYOUB STAR.jpg', 'Comedy/Lifestyle', 'M'),
('HAMZA SENHAJI', 'senhamza', '1M', 'influncers images/Mawazine SENHAJI.jpg', 'Comedy', 'M'),
('BILAL MOUHOUCH', 'bimothe1', '1M', 'influncers images/Bilal mouhouch.jpeg', 'Lifestyle', 'M'),
('RABIEKATI', 'rabiekati', '1M', 'influncers images/RABIEKATI.jpg', 'Actor', 'M'),
('FATIMAEZZAHRA_LAHRECH.OFFICIEL', 'fatimaezzahra_lahrech.officiel', '1M', 'influncers images/FATIMAEZZAHRA_LAHRECH.OFFICIEL.jpg', 'Actress', 'F'),
('AMIR WALID', 'amirwalidd', '956K', 'influncers images/Amir walid.jpeg', 'Lifestyle/Luxury', 'M'),
('CHEF WALID', 'mini_chefwalid', '942K', 'influncers images/CHEF WALID.jpg', 'Food/Cooking', 'M'),
('HIBA ESSABBAH', 'hibawitk', '892K', 'influncers images/HIBA ESSABBAH.jpg', 'Lifestyle', 'F'),
('ACHRAF NEDDAY', 'achrafnedday.officiel', '868K', 'influncers images/ACHRAF NEDDAY.jpg', 'Lifestyle/Comedy', 'M'),
('CHAIMAE BELKHIR', 'belkhirchaimae', '855K', 'influncers images/CHAIMAE BELKHIR.jpg', 'Lifestyle', 'F'),
('MERYEM CHADY', 'lacurlymorocco', '841K', 'influncers images/Meryem chadi.jpeg', 'Hair/Beauty', 'F'),
('SARA DIN', 'sara.dinz', '819K', 'influncers images/sara din.jpg', 'Lifestyle', 'F'),
('WALID LWAJDI', 'waliiid__48__', '800K', 'influncers images/walid lwajdi.jpg', 'Food/Cooking', 'M'),
('AMINE ZINEDDINE', 'aminezineddine', '754K', 'influncers images/amine zinnedine.jpg', 'Lifestyle/Comedy', 'M'),
('LAWLA_DOROFFF', 'lawla_dorofff', '739K', 'influncers images/lawla dorof.jpg', 'Football/Sport', 'F'),
('FADIL BASRI', 'fadel_trainer', '732K', 'influncers images/FADIL BASRI.jpg', 'Fitness/Coach', 'M'),
('9OSSOS', '9ossos', '703K', 'influncers images/9ossos.jpg', 'Food/Reviews', 'M'),
('EPER_OUSSAMA', 'eper_oussama', '654K', 'influncers images/eper oussama.jpg', 'Comedy', 'M'),
('GOUTTAY KHADIJA', 'khadija_gouttay', '625K', 'influncers images/gouttay khadija.jpg', 'Lifestyle', 'F'),
('MERYEM BNH', 'meryem._bnh', '575K', 'influncers images/meryem bnh.jpg', 'Lifestyle', 'F'),
('MATJAR.LAILA_OFFICIAL', 'matjar.laila_official', '561K', 'influncers images/matjar laila.jpg', 'Business/E-com', 'F'),
('YAHYA ABADA', 'yahyaa.abadaa', '553K', 'influncers images/yahya abada.jpg', 'Lifestyle/Model', 'M'),
('MALIKA BELAOUAD', 'malika_official26', '544K', 'influncers images/malika belouad.jpg', 'Lifestyle', 'F'),
('OMARBAIROUK', 'omarbairouk_', '519K', 'influncers images/omar bairouk.jpg', 'Lifestyle/Couple', 'M'),
('OUMNIA ESSEDDIQUI', 'oumnia_fd', '491K', 'https://image2url.com/images/1766188831038-b244bd05-4a0f-4ce1-8713-79289451b03a.jpg', 'Lifestyle', 'F'),
('AYA FRAYMIJA', 'aya.fraymija', '450K', 'influncers images/aya fraymija.jpg', 'Humor', 'F'),
('AHMED RIFAI', 'ahmed__rifai__19', '429K', 'influncers images/ahmed rifai.jpg', 'Lifestyle', 'M'),
('OMAR FADILII', 'omar_fadilii', '426K', 'influncers images/omar fadili.jpg', 'Food/Cooking', 'M'),
('TAHA RACHIDY', 'rachidy_taha', '402K', 'influncers images/taha rachidy.jpg', 'Filmmaking/Vlog', 'M'),
('SALOUITAAAA', 'salouitaaaa', '389K', 'influncers images/salouita.jpg', 'Humor/Criticism', 'F'),
('LKHTIBSIMO', 'lkhtibsimo1', '347K', 'influncers images/simo lkhtib.jpg', 'Humor', 'M'),
('MARWALAHLOU', 'marwalahlou', '330K', 'influncers images/marwalahlou.jpg', 'Lifestyle', 'F'),
('MOUNIAJAIDER', 'mouniajaider_officiel', '300K', 'influncers images/mounia jaider.jpg', 'Lifestyle', 'F'),
('MOHAMED MALI', 'mali_mohamd', '293K', 'influncers images/Mohamed mali.jpeg', 'Lifestyle', 'M'),
('LILY', 'ilham__elsa', '263K', 'influncers images/lily.jpg', 'Lifestyle/Beauty', 'F'),
('MAMTALO', 'mamtalo_o', '262K', 'influncers images/mamtalo.jpg', 'Digital Creator/Video', 'M'),
('BOUCHRA EL HAMMOUTI', 'bouchra.elhammouti', '259K', 'influncers images/bouchra el hammouti.jpg', 'Beauty/Model', 'F'),
('AYA IGOUDYANE', '_ayaigoudyane_', '251K', 'influncers images/aya igoudyane.jpg', 'Lifestyle', 'F'),
('MARWA', 'tester_with_marwa', '240K', 'influncers images/marwa.jpg', 'Food/Reviews', 'F'),
('BOTATOSALAH', 'botatosalah', '233K', 'influncers images/botato salah.jpg', 'Gaming/Humor', 'M'),
('ALI GE', 'ali_ge_officiel', '230K', 'influncers images/ali ge.jpg', 'Lifestyle', 'M'),
('MEHDI LAHLOU', 'mehdirevieww', '229K', 'influncers images/mehdi lahlou.jpg', 'Food/Reviews', 'M'),
('EL HABIB AIT EL FAQUIR', 'lovely_place_morocco', '227K', 'influncers images/el habib ait.jpg', 'Travel/Reviews', 'M'),
('BILAL AGBALO', 'bilalaghbalo1', '215K', 'influncers images/bilal agbalo.jpg', 'Lifestyle', 'M'),
('ADAMACHAB', 'adamachab.official', '200K', 'influncers images/adam achab.jpg', 'Travel/Humor/Reviews', 'M'),
('ZAKIABEAUTY', 'zakiabeauty', '197K', 'influncers images/zakia beauty.jpg', 'Beauty', 'F'),
('HAJARMASDOUKI.OFFICIEL', 'hajarmasdouki.officiel', '197K', 'influncers images/hajar masdouki.jpg', 'Actress', 'F'),
('YALA NKHARJO', 'yalankharjo', '174K', 'influncers images/yala nkhrjo.jpg', 'Travel/Food', 'M'),
('YASSINE ELKHALFI', 'yassine_elkhalfy', '170K', 'influncers images/yassin khalfi.jpg', 'Lifestyle', 'M'),
('SOUFIANE WAJIZ', 'soufianewajiz', '170K', 'influncers images/soufian wajiz.jpg', 'Actor/Travel', 'M'),
('KHAOULA', 'by_khaoula', '168K', 'influncers images/khaoula.jpg', 'Lifestyle', 'F'),
('ZAKARIAIKHALEF', 'zakaria_ikhalef', '167K', 'influncers images/ikhalef zakaria.jpg', 'Lifestyle', 'M'),
('TAL9ZDIRT_1', 'tal9zdirt_1', '150K', 'influncers images/tal9zdirt.jpg', 'Humor', 'M'),
('NWIWIRAT SALMA', 'nwiwirat_salma', '128K', 'influncers images/nwiwirat salma.jpg', 'Home/DIY', 'F'),
('MEHDI EL GHAZI', 'meg.psy', '127K', 'influncers images/mehdi el ghazi.jpg', 'Psychology', 'M'),
('NABIL ELMOHADDEB', 'lemhaddebnabil', '123K', 'influncers images/nabil elmhdeb.jpg', 'Lifestyle', 'M'),
('ISSAM KARMI', 'issam_karmi', '120K', 'influncers images/issam karmi.jpg', 'Lifestyle', 'M'),
('LBASSEL', 'lbassel_official', '116K', 'influncers images/lbassel.jpg', 'Humor', 'M'),
('CHAIMAA AGR', 'shaym.agr', '110K', 'influncers images/chaimaagr.jpg', 'Lifestyle', 'F'),
('FATHALAH BARCHA', 'fathalah_off', '109K', 'influncers images/fathalah barcha.jpg', 'Lifestyle', 'M'),
('R.DIIDIIYA', 'r.diidiiya', '102K', 'influncers images/r.diidiiya.jpg', 'Lifestyle', 'F'),
('NASSIM EL IDRISSI', 'nassim_el_idr', '45K', 'https://image2url.com/r2/default/images/1767443921927-00f78b36-3081-4e1a-999f-5ac646580522.jpg', 'UGC Creator/Food', 'M'),
('IDRISS ABIRI', 'idrissabiri', '235K', 'https://image2url.com/r2/default/images/1767443145298-eb2082cd-1687-4bc9-b0e0-b8da44658946.jpg', 'Lifestyle/Comedy', 'M'),
('HOUSSAM HADADI', 'houssam_hadadi', '85K', 'https://image2url.com/r2/default/images/1767443306280-5e212cd5-f08e-4e43-8833-a847fadd34fc.jpg', 'Lifestyle/Fitness', 'M'),
('AHMED LAGRAR', 'th3rays', '100K', 'https://image2url.com/r2/default/images/1767446053222-a6a0735b-d6a5-4317-ab43-f4107aef6a35.jpg', 'Fashion/Lifestyle', 'M'),
('MEHDI BARBIABE', 'fitwith_mehdi', '50K', 'https://image2url.com/r2/default/images/1767446448311-4592b3a4-b1e7-4c41-aeac-fb400ab80f6c.jpg', 'Fitness', 'M'),
('IMAD ESSATIR', 'sater_imad', '313K', 'https://image2url.com/r2/default/images/1767450519118-4c6b784e-3348-462c-8660-a11bb67b4a10.jpg', 'Lifestyle', 'M'),
('ELHOUSSAINE AKJTAOU', 'ryuvexy', '96K', 'influncers images/Elhoussaine akjtaou.jpeg', 'Fashion', 'M'),
('KHAOULA', 'kawlakmn', '92K', 'influncers images/kawlakmn.jpg', 'Lifestyle', 'F'),
('SAHARELMAATAOUI', 'saharelmaataoui', '90.1K', 'influncers images/saharelmaataoui.jpg', 'Actress/Beauty', 'F'),
('MEHDILOUBER6', 'mehdilouber6', '90K', 'influncers images/mehdilouber.jpg', 'Fashion/Streetwear', 'M'),
('AYOUB HAMDANI', 'ayoub.hamdanii', '83K', 'influncers images/ayoub.hamdanii.jpg', 'Lifestyle', 'M'),
('AYA HAD', 'aya.had1', '81K', 'influncers images/aya.had.jpg', 'Lifestyle', 'F'),
('DARIA VOLKOVA', 'daria_emerald777', '78K', 'influncers images/daria_emerald.jpg', 'Education', 'F'),
('FOOD SECRET''S', 'food5secrets', '77K', 'influncers images/food5secrets.jpg', 'Food/Cooking', 'F'),
('EMYBEAUTY 123', 'emybeauty123', '75K', 'influncers images/emybeauty.jpg', 'Beauty', 'F'),
('AMEL_MOHAMED_OFFICIEL', 'amel_mohamed_officiel', '74K', 'influncers images/amel_mohamed_officiel.jpg', 'Lifestyle', 'F'),
('AMAL BOUQDIR', 'amal.bouqdir', '69K', 'influncers images/amal.bouqdir.jpg', 'Lifestyle', 'F'),
('SABAH MEKOUAR HANOUF', 'mekouarsabah', '66K', 'influncers images/mekouarsabah.jpg', 'Lifestyle', 'F'),
('SOUKAINANAJI', 'soukaiinanaji', '63K', 'influncers images/soukaiinanaji.jpg', 'Beauty', 'F'),
('NIEMA.ELL', 'niema.ell', '58K', 'influncers images/niema.ell.jpg', 'Lifestyle', 'F'),
('MALLOUKA', 'mallouka_d', '55K', 'influncers images/mallouka_d.jpg', 'Lifestyle', 'F'),
('JOUHAINA AIT EL OURF', 'jouhaina_aitelourf', '55K', 'influncers images/jouhaina_aitelourf.jpg', 'Lifestyle', 'F'),
('TAIB KENIZA OFFICIEL', 'taib_keniza_officiel', '45K', 'influncers images/taib_keniza_officiel.jpg', 'Lifestyle', 'F'),
('LOUBNA.HABOUBA', 'loubna.habouba', '42K', 'influncers images/loubna.habouba.jpg', 'Lifestyle', 'F'),
('SAMIAAA ELD', 'samiaaa_eld', '42K', 'influncers images/samiaaa_eld.jpg', 'Lifestyle', 'F'),
('DOHA.CARMEN', 'doha.carmen', '41K', 'influncers images/doha.carmen.jpg', 'Beauty', 'F'),
('ZAYNAP AMRANI', 'zaynap_amrani', '39K', 'influncers images/zaynap_amrani.jpg', 'Lifestyle', 'F'),
('NOUR EL HOUDA', 'houda_elmabchour', '39K', 'influncers images/houda_elmabchour.jpg', 'Lifestyle', 'F'),
('HAJOURA AR1', 'hajoura_ar1', '38K', 'influncers images/hajoura_ar1.jpg', 'Lifestyle', 'F'),
('MARYAM BKH', 'nutellamimii', '37K', 'influncers images/MARYAM BKH.jpg', 'Lifestyle', 'F'),
('LOUBNA.ELYAMANI', 'loubna.elyamani', '37K', 'influncers images/loubna.elyamani.jpg', 'Lifestyle', 'F'),
('AMBERNAJI', 'ambernaji', '35K', 'influncers images/ambernaji.jpg', 'Lifestyle', 'F'),
('HICHAM TOUMI', 'hicham_toumi07', '33K', 'influncers images/hicham toumi.jpg', 'Lifestyle', 'M'),
('NOUHAILA BEKKALI', 'nouhaila_makeup_artist', '32K', 'influncers images/nouhaila_bekkali_mkp.jpg', 'Beauty', 'F'),
('ADWORLD', 'adworld.ma', '31K', 'influncers images/adworld.ma.jpg', 'Marketing', 'M'),
('OUMNIINAA', 'oumniinaa', '28K', 'influncers images/oumniinaa.jpg', 'Lifestyle', 'F'),
('IMANE SEFF', 'imaneseff', '28K', 'influncers images/imaneseff.jpg', 'Lifestyle', 'F'),
('NUTELLAMIMII', 'nutellamimii', '23K', 'influncers images/nutellamimii.jpg', 'Fashion/Lifestyle', 'M'),
('DUNYA', 'beautybydunyaa_', '23K', 'influncers images/beautybydunyaa_.jpg', 'Beauty', 'F'),
('MISS_MOTIV.ACTION', 'miss_motiv.action', '21K', 'influncers images/miss_motiv.action.jpg', 'Motivation', 'F'),
('NADA DH', 'nuida_kitchen', '20K', 'influncers images/Nada dh.jpeg', 'Food', 'F'),
('YOUSRA_BOUKRII', 'yousra_boukrii', '19K', 'influncers images/yousra_boukrii.jpg', 'Lifestyle', 'F'),
('ZINA_ELOUARDKANE', 'zina_elouardkane', '18K', 'influncers images/zina_elouardkane.jpg', 'Lifestyle', 'F'),
('OUSSAMAHANINEE', 'oussamahaninee', '17K', 'influncers images/oussamahaninee.jpg', 'Lifestyle', 'M'),
('RIMBAIROUK', 'rimbairouk', '17K', 'influncers images/rimbairouk.jpg', 'Lifestyle', 'F'),
('NADA NACRI', 'nada_nacri', '17K', 'influncers images/nada_nacri.jpg', 'Lifestyle', 'F'),
('SOJOLIFE7', 'sojolife7', '14K', 'influncers images/sojolife7.jpg', 'Lifestyle', 'F'),
('IMANE_MIRAZ', 'imane_miraz', '13K', 'influncers images/imane_miraz.jpg', 'Lifestyle', 'F'),
('TAHA_HAFSI', 'taha_hafsi', '12K', 'influncers images/taha_hafsi.jpg', 'Lifestyle', 'M'),
('IMANE FARAH', 'imanefarahofficiel', '10K', 'influncers images/imanefarahofficiel.jpg', 'Lifestyle', 'F'),
('SELMA ELIDRISSI', 'selma.edrissi', '6K', 'influncers images/selma.edrissi.jpg', 'Lifestyle', 'F'),
('ADIL.LE.CASABLANCAIS', 'adil.le.casablancais', '5K', 'influncers images/adil.le.casablancais.jpg', 'Lifestyle', 'M'),
('AYOUB DIGO', 'ayoub_digo_', '3K', 'influncers images/ayoub_digo_.jpg', 'Lifestyle', 'M'),
('MUA.YASMINA', 'mua.yasmina', '1K', 'influncers images/mua.yasmina.jpg', 'Beauty/Makeup', 'F');
