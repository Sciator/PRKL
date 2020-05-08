{ print("\n    Prvocisla do 1000\n\n");

  cislo=2;
  pocet=0;

  do { prvocislo=true;
       for (delitel=2; delitel*delitel<=cislo && prvocislo; ++delitel) { if (cislo%delitel==0) prvocislo=false; }
     
       if (prvocislo) { print("%5i",cislo);
                        if (++pocet%10==0) print("\n");
                      }
     } while (++cislo<1000);

  print("\n\n");
}