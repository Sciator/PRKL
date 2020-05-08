{ print("Zadej nezaporne cislo: ");
  scan(a);

  if (a<0) print("\nChybne cislo\n\n");

  else { print("\n\nBinarni zapis: ");

         tisk=false;

         for (b=1<<30; b>0; b>>=1) { bit=a&b;
                                     if (tisk || bit!=0 || b==1) { if (bit!=0) print("1"); else print("0"); tisk=true; }
                                   }
         print("\n\n");
       }
}