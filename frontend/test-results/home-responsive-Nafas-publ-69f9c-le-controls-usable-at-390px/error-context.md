# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-responsive.spec.ts >> Nafas public homepage >> keeps key mobile controls usable at 390px
- Location: tests\home-responsive.spec.ts:150:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 38

- Array []
+ Array [
+   Object {
+     "className": "anh-button anh-button--secondary",
+     "label": "استكشف",
+     "parentClass": "anh-compare-card",
+     "rect": Object {
+       "height": 42,
+       "left": -57.171875,
+       "right": 179.921875,
+       "width": 237.09375,
+     },
+     "section": "comparison",
+   },
+   Object {
+     "className": "anh-button anh-button--secondary",
+     "label": "استكشف",
+     "parentClass": "anh-compare-card",
+     "rect": Object {
+       "height": 42,
+       "left": -57.171875,
+       "right": 179.921875,
+       "width": 237.09375,
+     },
+     "section": "comparison",
+   },
+   Object {
+     "className": "anh-button anh-button--secondary",
+     "label": "استكشف",
+     "parentClass": "anh-compare-card",
+     "rect": Object {
+       "height": 42,
+       "left": -57.171875,
+       "right": 179.921875,
+       "width": 237.09375,
+     },
+     "section": "comparison",
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner:
    - navigation "Nafas" [ref=e4]:
      - link "Nafas" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - button "English" [ref=e8] [cursor=pointer]:
          - generic [ref=e10]: ع
          - generic [ref=e11]: EN
        - button "السلة" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e15]: ٠
        - button "القائمة" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
  - main [ref=e19]:
    - generic [ref=e20]:
      - region "إعلان نفس" [ref=e21]:
        - paragraph [ref=e22]: "مجموعة نفس الأولى كاملة الآن: ست روائح، مجموعة تجربة، واختيار أهدأ قبل الزجاجة."
        - link "جرّب قبل ما تختار" [ref=e23] [cursor=pointer]:
          - /url: /discovery-set
      - region "كل نفس... بيحكي عنك" [ref=e24]:
        - generic [ref=e36]:
          - generic [ref=e37]: Nafas
          - strong [ref=e38]: Sharara
        - generic [ref=e41]:
          - paragraph [ref=e42]: دار نفس
          - heading "كل نفس... بيحكي عنك" [level=1] [ref=e43]
          - paragraph [ref=e44]: عطور مصممة بعناية، متعتقة، ومتوازنة. ابدأ بشرارة أو جرّب الست روائح في مجموعة التجربة.
          - generic [ref=e45]:
            - link "تسوق الكولكشن" [ref=e46] [cursor=pointer]:
              - /url: "#choose"
            - link "مجموعة التجربة" [ref=e47] [cursor=pointer]:
              - /url: /discovery-set
      - region "اكتشف نفسك من أول رشة." [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]:
            - paragraph [ref=e51]: لمحات المجموعة
            - heading "اكتشف نفسك من أول رشة." [level=2] [ref=e52]
          - region "عرض لمحات العطور" [ref=e53]:
            - generic [ref=e54]:
              - article [ref=e55]:
                - generic [ref=e56]:
                  - generic [ref=e57]: توابل فريش
                  - heading "شرارة" [level=3] [ref=e58]
                  - paragraph [ref=e59]: أول رشة تلفت، وأثر مسكي داكن يفضل.
                - generic [ref=e65]:
                  - generic [ref=e66]: Nafas
                  - strong [ref=e67]: Sharara
              - article [ref=e69]:
                - generic [ref=e70]:
                  - generic [ref=e71]: حركة نضيفة
                  - heading [level=3] [ref=e72]: مدار
                  - paragraph [ref=e73]: فريش خشبي رياضي يدور معاك طول اليوم.
                - generic [ref=e79]:
                  - generic [ref=e80]: Nafas
                  - strong [ref=e81]: Madar
              - article [ref=e83]:
                - generic [ref=e84]:
                  - generic [ref=e85]: أثر عميق
                  - heading [level=3] [ref=e86]: أثر
                  - paragraph [ref=e87]: داكن وفريش وخشبي، يسبقك ويفضل بعدك.
                - generic [ref=e93]:
                  - generic [ref=e94]: Nafas
                  - strong [ref=e95]: Athar
              - article [ref=e97]:
                - generic [ref=e98]:
                  - generic [ref=e99]: لمعة قهوة
                  - heading [level=3] [ref=e100]: برق
                  - paragraph [ref=e101]: قهوة باردة بطابع فريش حار ولمعة دافئة.
                - generic [ref=e107]:
                  - generic [ref=e108]: Nafas
                  - strong [ref=e109]: Barq
              - article [ref=e111]:
                - generic [ref=e112]:
                  - generic [ref=e113]: نضافة فريش
                  - heading [level=3] [ref=e114]: ندى
                  - paragraph [ref=e115]: فريش، نضيف، وأنثوي بنعومة روز جولد.
                - generic [ref=e121]:
                  - generic [ref=e122]: Nafas
                  - strong [ref=e123]: Nada
              - article [ref=e125]:
                - generic [ref=e126]:
                  - generic [ref=e127]: هدية ناعمة
                  - heading [level=3] [ref=e128]: غيمة
                  - paragraph [ref=e129]: نعومة بتتعرف من غير صوت، فاكهية ومسك نضيف.
                - generic [ref=e135]:
                  - generic [ref=e136]: Nafas
                  - strong [ref=e137]: Ghayma
              - article [ref=e139]:
                - generic [ref=e140]:
                  - generic [ref=e141]: جرّب أولاً
                  - heading [level=3] [ref=e142]: مجموعة التجربة
                  - paragraph [ref=e143]: جرّب الست روائح قبل اختيار الزجاجة.
              - article [ref=e144]:
                - generic [ref=e145]:
                  - generic [ref=e146]: جاهزة للإهداء
                  - heading [level=3] [ref=e147]: هدايا نفس
                  - paragraph [ref=e148]: اختيارات هادئة للهدايا الرجالي والحريمي.
              - article [ref=e149]:
                - generic [ref=e150]:
                  - generic [ref=e151]: مراجعة الدفعات
                  - heading [level=3] [ref=e152]: طقس الجودة
                  - paragraph [ref=e153]: تعتيق ومراجعة للصفاء والرش والتقديم.
          - generic "أدوات عرض اللمحات" [ref=e154]:
            - button "إيقاف العرض التلقائي" [ref=e155] [cursor=pointer]:
              - img [ref=e156]
            - tablist "شرائح اللمحات" [ref=e158]:
              - tab "اعرض شرارة" [selected] [ref=e159] [cursor=pointer]
              - tab "اعرض مدار" [ref=e160] [cursor=pointer]
              - tab "اعرض أثر" [ref=e161] [cursor=pointer]
              - tab "اعرض برق" [ref=e162] [cursor=pointer]
              - tab "اعرض ندى" [ref=e163] [cursor=pointer]
              - tab "اعرض غيمة" [ref=e164] [cursor=pointer]
              - tab "اعرض مجموعة التجربة" [ref=e165] [cursor=pointer]
              - tab "اعرض هدايا نفس" [ref=e166] [cursor=pointer]
              - tab "اعرض طقس الجودة" [ref=e167] [cursor=pointer]
      - region "رائحة تشبه حضورك." [ref=e168]:
        - generic [ref=e169]:
          - generic [ref=e170]:
            - paragraph [ref=e171]: لحظة العلامة
            - heading "رائحة تشبه حضورك." [level=2] [ref=e172]
            - paragraph [ref=e173]: "ست روائح واضحة من نفس: شرارة، مدار، أثر، برق، ندى، وغيمة. كل واحدة لها مود، لون، وحضور."
          - generic [ref=e174]:
            - generic [ref=e180]:
              - generic [ref=e181]: Nafas
              - strong [ref=e182]: Sharara
            - generic [ref=e189]:
              - generic [ref=e190]: Nafas
              - strong [ref=e191]: Madar
            - generic [ref=e198]:
              - generic [ref=e199]: Nafas
              - strong [ref=e200]: Athar
            - generic [ref=e207]:
              - generic [ref=e208]: Nafas
              - strong [ref=e209]: Barq
            - generic [ref=e216]:
              - generic [ref=e217]: Nafas
              - strong [ref=e218]: Nada
            - generic [ref=e225]:
              - generic [ref=e226]: Nafas
              - strong [ref=e227]: Ghayma
      - region "خذ نظرة أقرب." [ref=e229]:
        - generic [ref=e230]:
          - generic [ref=e231]:
            - paragraph [ref=e232]: عارض العطور
            - heading "خذ نظرة أقرب." [level=2] [ref=e233]
          - generic [ref=e234]:
            - generic "اختيار العطر" [ref=e235]:
              - button "شرارة" [pressed] [ref=e236] [cursor=pointer]
              - button "مدار" [ref=e237] [cursor=pointer]
              - button "أثر" [ref=e238] [cursor=pointer]
              - button "برق" [ref=e239] [cursor=pointer]
              - button "ندى" [ref=e240] [cursor=pointer]
              - button "غيمة" [ref=e241] [cursor=pointer]
            - generic [ref=e249]:
              - generic [ref=e250]: Nafas
              - strong [ref=e251]: Sharara
            - generic [ref=e253]:
              - generic [ref=e254]: Sharara
              - heading "شرارة" [level=3] [ref=e255]
              - paragraph [ref=e256]: أول رشة تلفت، وأثر يفضل. فريش / حار / مسكي داكن.
              - generic "تفاصيل العطر" [ref=e257]:
                - button "الرائحة" [pressed] [ref=e258] [cursor=pointer]
                - button "النوتات" [ref=e259] [cursor=pointer]
                - button "العبوة" [ref=e260] [cursor=pointer]
                - button "الأحجام" [ref=e261] [cursor=pointer]
                - button "الهدية" [ref=e262] [cursor=pointer]
                - button "الاستخدام" [ref=e263] [cursor=pointer]
              - link "شاهد التفاصيل" [ref=e264] [cursor=pointer]:
                - /url: /products/sharara
      - region "رحلة الرشة." [ref=e265]:
        - generic [ref=e266]:
          - generic [ref=e267]:
            - paragraph [ref=e268]: رحلة الرشة
            - heading "رحلة الرشة." [level=2] [ref=e269]
          - generic [ref=e270]:
            - article [ref=e271]:
              - generic [ref=e272]:
                - text: "01"
                - heading "الافتتاحية" [level=3] [ref=e273]
                - paragraph [ref=e274]: أول لمعة من الرائحة تفتح المزاج وتحدد الاتجاه.
            - article [ref=e275]:
              - generic [ref=e276]:
                - text: "02"
                - heading "القلب" [level=3] [ref=e277]
                - paragraph [ref=e278]: "بعد دقائق، الشخصية تظهر: فريش، داكن، ناعم، أو دافئ."
            - article [ref=e279]:
              - generic [ref=e280]:
                - text: "03"
                - heading "الأثر" [level=3] [ref=e281]
                - paragraph [ref=e282]: الجزء الذي يبقى قريباً من الجلد ويعود في الذاكرة.
      - region "من الافتتاحية إلى الأثر." [ref=e283]:
        - generic [ref=e289]:
          - paragraph [ref=e290]: من الرشة للأثر
          - heading "من الافتتاحية إلى الأثر." [level=2] [ref=e291]
          - article [ref=e292]:
            - strong [ref=e293]: الافتتاحية
            - paragraph [ref=e294]: نفحة أولى تلمع وتدعو للاقتراب.
          - article [ref=e295]:
            - strong [ref=e296]: القلب
            - paragraph [ref=e297]: المود الحقيقي يستقر بهدوء على الجلد.
          - article [ref=e298]:
            - strong [ref=e299]: القاعدة
            - paragraph [ref=e300]: مسك، خشب، عنبر، ولمسة أخيرة تترك أثر.
      - region "ابدأ بتستر، واختر بدقة." [ref=e301]:
        - generic [ref=e302]:
          - generic [ref=e303]:
            - paragraph [ref=e304]: مجموعة التجربة
            - heading "ابدأ بتستر، واختر بدقة." [level=2] [ref=e305]
          - generic [ref=e306]:
            - generic [ref=e307]:
              - article [ref=e308]:
                - generic [ref=e309]: "01"
                - img [ref=e310]
                - heading "اطلب مجموعة التجربة" [level=3] [ref=e312]
                - paragraph [ref=e313]: ست عينات صغيرة من كل الكولكشن.
              - article [ref=e314]:
                - generic [ref=e315]: "02"
                - img [ref=e316]
                - heading "جرّبه يوم كامل" [level=3] [ref=e318]
                - paragraph [ref=e319]: اترك الرائحة تظهر على جلدك في وقتها.
              - article [ref=e320]:
                - generic [ref=e321]: "03"
                - img [ref=e322]
                - heading "اختر زجاجتك" [level=3] [ref=e324]
                - paragraph [ref=e325]: حدد الرائحة الأقرب لحضورك.
              - article [ref=e326]:
                - generic [ref=e327]: "04"
                - img [ref=e328]
                - heading "ارجع لنفس الرائحة" [level=3] [ref=e330]
                - paragraph [ref=e331]: أعد الطلب عندما يستقر اختيارك.
            - generic [ref=e332]:
              - link "اطلب مجموعة التجربة" [ref=e333] [cursor=pointer]:
                - /url: /discovery-set
              - link "اسألنا على واتساب" [ref=e334] [cursor=pointer]:
                - /url: https://wa.me/21007489872?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D8%A7%D8%AE%D8%AA%D9%8A%D8%A7%D8%B1%20%D8%B9%D8%B7%D8%B1%20%D9%85%D9%86%20%D9%86%D9%81%D8%B3
              - link "شاهد العطور" [ref=e335] [cursor=pointer]:
                - /url: "#choose"
      - region "مجموعة التجربة جزء من الرحلة." [ref=e336]:
        - generic [ref=e337]:
          - generic [ref=e338]:
            - paragraph [ref=e339]: جرّب قبل ما تختار
            - heading "مجموعة التجربة جزء من الرحلة." [level=2] [ref=e340]
            - paragraph [ref=e341]: ست عينات صغيرة تساعدك تلبس كل عطر في يومك قبل اختيار الزجاجة الأقرب لحضورك.
            - link "اطلب مجموعة التجربة" [ref=e342] [cursor=pointer]:
              - /url: /discovery-set
          - generic [ref=e349]:
            - generic [ref=e350]: Nafas
            - strong [ref=e351]: Sharara
      - region "اختيار العطر أسهل." [ref=e353]:
        - generic [ref=e355]:
          - generic [ref=e356]:
            - paragraph [ref=e357]: اختيار العطر
            - heading "اختيار العطر أسهل." [level=2] [ref=e358]
            - paragraph [ref=e359]: اختار المود الأقرب لك هنا، أو ادخل لاكتشاف عطرك بخطوات أهدأ وتوصية أوضح.
          - generic "اختيار المود" [ref=e360]:
            - button "فريش حار" [ref=e361] [cursor=pointer]
            - button "فريش يومي" [ref=e362] [cursor=pointer]
            - button "غامق خشبي" [ref=e363] [cursor=pointer]
            - button "قهوة دافئة" [ref=e364] [cursor=pointer]
            - button "نظيف أنثوي" [ref=e365] [cursor=pointer]
            - button "ناعم هدية" [ref=e366] [cursor=pointer]
            - button "لسه محتار" [pressed] [ref=e367] [cursor=pointer]
          - paragraph [ref=e368]:
            - text: "اقتراح نفس:"
            - strong [ref=e369]: مجموعة التجربة
          - generic [ref=e370]:
            - link "اكتشف عطرك" [ref=e371] [cursor=pointer]:
              - /url: /scent-finder
            - link "مجموعة التجربة" [ref=e372] [cursor=pointer]:
              - /url: /discovery-set
      - region "وضوح في التجربة والجودة." [ref=e373]:
        - generic [ref=e374]:
          - generic [ref=e375]:
            - paragraph [ref=e376]: ثقة بلا مبالغة
            - heading "وضوح في التجربة والجودة." [level=2] [ref=e377]
          - generic [ref=e378]:
            - article [ref=e379]:
              - img [ref=e380]
              - heading "تركيز واضح" [level=3] [ref=e382]
              - paragraph [ref=e383]: نذكر 24% بشكل تجاري واضح، بدون كشف أي تفاصيل داخلية.
            - article [ref=e384]:
              - img [ref=e385]
              - heading "مراجعة الدفعات" [level=3] [ref=e387]
              - paragraph [ref=e388]: تعتيق 21-30 يوم ومراجعة عملية للصفاء والرش والتقديم.
            - article [ref=e389]:
              - img [ref=e390]
              - heading "التجربة أولاً" [level=3] [ref=e392]
              - paragraph [ref=e393]: مجموعة التجربة تساعدك تختار بهدوء قبل الزجاجة.
            - article [ref=e394]:
              - img [ref=e395]
              - heading "دعم واتساب" [level=3] [ref=e397]
              - paragraph [ref=e398]: اسألنا عن المود، الحجم، أو الهدية المناسبة بدون ضغط.
      - region "اختر نفسك." [ref=e399]:
        - generic [ref=e400]:
          - generic [ref=e401]:
            - paragraph [ref=e402]: ساعدني أختار
            - heading "اختر نفسك." [level=2] [ref=e403]
          - generic [ref=e404]:
            - article [ref=e405]:
              - img "زجاجة عطر شرارة" [ref=e406]:
                - generic [ref=e412]:
                  - generic [ref=e413]: Nafas
                  - strong [ref=e414]: Sharara
              - generic [ref=e416]: Sharara
              - heading "شرارة" [level=3] [ref=e417]
              - paragraph [ref=e418]: أول رشة تلفت، وأثر يفضل.
              - generic [ref=e419]:
                - generic [ref=e420]:
                  - term [ref=e421]: المود
                  - definition [ref=e422]: فريش / حار / مسكي داكن
                - generic [ref=e423]:
                  - term [ref=e424]: يناسب
                  - definition [ref=e425]: حضور رجالي واضح من أول لحظة.
                - generic [ref=e426]:
                  - term [ref=e427]: نقطة البداية
                  - definition [ref=e428]: العطر البطل في الكولكشن.
              - link "استكشف" [ref=e429] [cursor=pointer]:
                - /url: /products/sharara
            - article [ref=e430]:
              - img "زجاجة عطر مدار" [ref=e431]:
                - generic [ref=e437]:
                  - generic [ref=e438]: Nafas
                  - strong [ref=e439]: Madar
              - generic [ref=e441]: Madar
              - heading "مدار" [level=3] [ref=e442]
              - paragraph [ref=e443]: فريش يدور معاك طول اليوم.
              - generic [ref=e444]:
                - generic [ref=e445]:
                  - term [ref=e446]: المود
                  - definition [ref=e447]: فريش / خشبي / رياضي
                - generic [ref=e448]:
                  - term [ref=e449]: يناسب
                  - definition [ref=e450]: روتين يومي فريش ورجالي.
                - generic [ref=e451]:
                  - term [ref=e452]: نقطة البداية
                  - definition [ref=e453]: ابدأ به لو بتحب الفريش.
              - link "استكشف" [ref=e454] [cursor=pointer]:
                - /url: /products/madar
            - article [ref=e455]:
              - img "زجاجة عطر أثر" [ref=e456]:
                - generic [ref=e462]:
                  - generic [ref=e463]: Nafas
                  - strong [ref=e464]: Athar
              - generic [ref=e466]: Athar
              - heading "أثر" [level=3] [ref=e467]
              - paragraph [ref=e468]: يسبقك ويفضل بعدك.
              - generic [ref=e469]:
                - generic [ref=e470]:
                  - term [ref=e471]: المود
                  - definition [ref=e472]: داكن / فريش / خشبي
                - generic [ref=e473]:
                  - term [ref=e474]: يناسب
                  - definition [ref=e475]: مناسبات، مساء، وحضور واثق.
                - generic [ref=e476]:
                  - term [ref=e477]: نقطة البداية
                  - definition [ref=e478]: اختيار المناسبات الهادية.
              - link "استكشف" [ref=e479] [cursor=pointer]:
                - /url: /products/athar
            - article [ref=e480]:
              - img "زجاجة عطر برق" [ref=e481]:
                - generic [ref=e487]:
                  - generic [ref=e488]: Nafas
                  - strong [ref=e489]: Barq
              - generic [ref=e491]: Barq
              - heading "برق" [level=3] [ref=e492]
              - paragraph [ref=e493]: قهوة باردة بطابع فريش حار.
              - generic [ref=e494]:
                - generic [ref=e495]:
                  - term [ref=e496]: المود
                  - definition [ref=e497]: فريش / حار / قهوة
                - generic [ref=e498]:
                  - term [ref=e499]: يناسب
                  - definition [ref=e500]: مزاج مختلف وملفت.
                - generic [ref=e501]:
                  - term [ref=e502]: نقطة البداية
                  - definition [ref=e503]: لما تحب حاجة مختلفة.
              - link "استكشف" [ref=e504] [cursor=pointer]:
                - /url: /products/barq
            - article [ref=e505]:
              - img "زجاجة عطر ندى" [ref=e506]:
                - generic [ref=e512]:
                  - generic [ref=e513]: Nafas
                  - strong [ref=e514]: Nada
              - generic [ref=e516]: Nada
              - heading "ندى" [level=3] [ref=e517]
              - paragraph [ref=e518]: فريش، نضيف، وأنثوي.
              - generic [ref=e519]:
                - generic [ref=e520]:
                  - term [ref=e521]: المود
                  - definition [ref=e522]: فريش / فاكهي / نظيف
                - generic [ref=e523]:
                  - term [ref=e524]: يناسب
                  - definition [ref=e525]: يوم نضيف وهادئ.
                - generic [ref=e526]:
                  - term [ref=e527]: نقطة البداية
                  - definition [ref=e528]: فريش ناعم وواضح.
              - link "استكشف" [ref=e529] [cursor=pointer]:
                - /url: /products/nada
            - article [ref=e530]:
              - img "زجاجة عطر غيمة" [ref=e531]:
                - generic [ref=e537]:
                  - generic [ref=e538]: Nafas
                  - strong [ref=e539]: Ghayma
              - generic [ref=e541]: Ghayma
              - heading "غيمة" [level=3] [ref=e542]
              - paragraph [ref=e543]: نعومة بتتعرف من غير صوت.
              - generic [ref=e544]:
                - generic [ref=e545]:
                  - term [ref=e546]: المود
                  - definition [ref=e547]: فاكهي / مسكي / ناعم
                - generic [ref=e548]:
                  - term [ref=e549]: يناسب
                  - definition [ref=e550]: هدية ناعمة أو يوم هادي.
                - generic [ref=e551]:
                  - term [ref=e552]: نقطة البداية
                  - definition [ref=e553]: اختيار ناعم ومريح.
              - link "استكشف" [ref=e554] [cursor=pointer]:
                - /url: /products/ghayma
      - region "كمّل الرحلة." [ref=e555]:
        - generic [ref=e556]:
          - generic [ref=e557]:
            - paragraph [ref=e558]: استمر في الرحلة
            - heading "كمّل الرحلة." [level=2] [ref=e559]
          - generic [ref=e560]:
            - link "المتجر تسوق الكولكشن الأساسي." [ref=e561] [cursor=pointer]:
              - /url: /shop
              - heading "المتجر" [level=3] [ref=e562]
              - paragraph [ref=e563]: تسوق الكولكشن الأساسي.
            - link "مجموعة التجربة جرّب الست روائح قبل الزجاجة." [ref=e564] [cursor=pointer]:
              - /url: /discovery-set
              - heading "مجموعة التجربة" [level=3] [ref=e565]
              - paragraph [ref=e566]: جرّب الست روائح قبل الزجاجة.
            - link "الهدايا اختيارات رجالي وحريمي بهدوء." [ref=e567] [cursor=pointer]:
              - /url: /gift-boxes
              - heading "الهدايا" [level=3] [ref=e568]
              - paragraph [ref=e569]: اختيارات رجالي وحريمي بهدوء.
            - link "اكتشف عطرك اختبار سريع يرشح لك عطر مناسب." [ref=e570] [cursor=pointer]:
              - /url: /scent-finder
              - heading "اكتشف عطرك" [level=3] [ref=e571]
              - paragraph [ref=e572]: اختبار سريع يرشح لك عطر مناسب.
            - link "واتساب اسألنا أو اطلب مباشرة." [ref=e573] [cursor=pointer]:
              - /url: https://wa.me/21007489872?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D9%86%D9%81%D8%B3
              - heading "واتساب" [level=3] [ref=e574]
              - paragraph [ref=e575]: اسألنا أو اطلب مباشرة.
      - region "نفس قريب منك." [ref=e576]:
        - heading "نفس قريب منك." [level=2] [ref=e577]
        - paragraph [ref=e578]: ابدأ بعطر واحد أو بمجموعة التجربة، ودع الرائحة تختار سرعتها على جلدك.
        - link "اكتشف عطرك" [ref=e579] [cursor=pointer]:
          - /url: /scent-finder
  - contentinfo [ref=e580]:
    - generic [ref=e581]:
      - generic [ref=e582]:
        - img "Nafas" [ref=e583]
        - heading "دار نفَس" [level=2] [ref=e584]
        - paragraph [ref=e585]: "دار عطرية عربية تبدأ بالتجربة الهادئة: تستر أولاً، اختيار أوضح، ووعود واقعية تناسب العطر الحقيقي."
        - link "واتساب" [ref=e586] [cursor=pointer]:
          - /url: https://wa.me/201000000000
          - img [ref=e587]
          - text: واتساب
      - navigation "التسوق" [ref=e589]:
        - heading "التسوق" [level=3] [ref=e590]
        - link "كل العطور" [ref=e591] [cursor=pointer]:
          - /url: /shop
        - link "اكتشف عطرك" [ref=e592] [cursor=pointer]:
          - /url: /scent-finder
        - link "مجموعة التجربة" [ref=e593] [cursor=pointer]:
          - /url: /discovery-set
        - link "الهدايا" [ref=e594] [cursor=pointer]:
          - /url: /gift-boxes
        - link "المفضلة" [ref=e595] [cursor=pointer]:
          - /url: /favorites
        - link "الجودة" [ref=e596] [cursor=pointer]:
          - /url: /quality
      - navigation "المساندة" [ref=e597]:
        - heading "المساندة" [level=3] [ref=e598]
        - link "الأسئلة" [ref=e599] [cursor=pointer]:
          - /url: /faq
        - link "الحساب" [ref=e600] [cursor=pointer]:
          - /url: /account
        - link "عن نفَس" [ref=e601] [cursor=pointer]:
          - /url: /about
      - navigation "القانونية" [ref=e602]:
        - heading "القانونية" [level=3] [ref=e603]
        - link "الخصوصية" [ref=e604] [cursor=pointer]:
          - /url: /privacy-policy
        - link "الاسترجاع" [ref=e605] [cursor=pointer]:
          - /url: /return-policy
        - link "الشروط" [ref=e606] [cursor=pointer]:
          - /url: /terms
    - generic [ref=e607]:
      - paragraph [ref=e608]: تختلف مدة ثبات وفوحان العطر حسب البشرة، الطقس، وطريقة الاستخدام. نركز على تجربة واضحة ومريحة بدون مبالغات.
      - generic [ref=e609]: نفَس © 2026
```

# Test source

```ts
  79  |         '[data-section="product-viewer"] .anh-section-head h2',
  80  |         '[data-section="story-chapters"] .anh-section-head h2',
  81  |         '[data-section="senses"] h2',
  82  |         '[data-section="tester-to-bottle"] .anh-section-head h2',
  83  |         '[data-section="better-together"] h2',
  84  |         '[data-section="scent-selector"] h2',
  85  |         '[data-section="trust"] h2',
  86  |         '[data-section="comparison"] h2',
  87  |         '[data-section="keep-exploring"] h2',
  88  |         '[data-section="final-cta"] h2',
  89  |       ];
  90  | 
  91  |       const headings = headingSelectors.map((selector) => {
  92  |         const element = document.querySelector(selector);
  93  |         return {
  94  |           fontSize: element ? Number.parseFloat(window.getComputedStyle(element).fontSize) : 0,
  95  |           selector,
  96  |         };
  97  |       });
  98  | 
  99  |       const sections = [...document.querySelectorAll<HTMLElement>('.apple-nafas-page > [data-section]:not(.anh-ribbon)')]
  100 |         .map((element) => ({
  101 |           height: element.getBoundingClientRect().height,
  102 |           paddingBottom: Number.parseFloat(window.getComputedStyle(element).paddingBottom),
  103 |           paddingTop: Number.parseFloat(window.getComputedStyle(element).paddingTop),
  104 |         }));
  105 | 
  106 |       return { headings, sections };
  107 |     });
  108 | 
  109 |     for (const heading of metrics.headings) {
  110 |       expect(heading.fontSize, heading.selector).toBeGreaterThan(0);
  111 |       expect(heading.fontSize, heading.selector).toBeLessThanOrEqual(96);
  112 |     }
  113 | 
  114 |     for (const section of metrics.sections) {
  115 |       expect(section.height).toBeGreaterThan(180);
  116 |       expect(section.height).toBeLessThanOrEqual(980);
  117 |       expect(section.paddingTop).toBeLessThanOrEqual(112);
  118 |       expect(section.paddingBottom).toBeLessThanOrEqual(112);
  119 |     }
  120 | 
  121 |     await expectNoHorizontalOverflow(page);
  122 |   });
  123 | 
  124 |   test('supports Arabic RTL and English LTR from LocaleContext', async ({ page }) => {
  125 |     await gotoHome(page, 'ar');
  126 |     await expect(page.locator('.apple-nafas-page')).toHaveAttribute('dir', 'rtl');
  127 |     await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  128 | 
  129 |     await gotoHome(page, 'en');
  130 |     await expect(page.locator('.apple-nafas-page')).toHaveAttribute('dir', 'ltr');
  131 |     await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  132 |   });
  133 | 
  134 |   test('supports highlights carousel controls and keyboard navigation', async ({ page }) => {
  135 |     await gotoHome(page);
  136 |     const highlights = page.locator('[data-section="highlights"]');
  137 | 
  138 |     await expect(highlights).toBeVisible();
  139 |     await expect(highlights.locator('.anh-carousel-dock .anh-dock-button')).toBeVisible();
  140 |     await expect(page.getByTestId('highlight-dot-1')).toBeVisible();
  141 | 
  142 |     await page.getByTestId('highlight-dot-1').click();
  143 |     await expect(highlights.locator('.anh-highlight-card').nth(1)).toHaveAttribute('data-active', 'true');
  144 | 
  145 |     await highlights.locator('.anh-highlight-shell').focus();
  146 |     await page.keyboard.press('ArrowRight');
  147 |     await expect(highlights.locator('.anh-highlight-card').nth(2)).toHaveAttribute('data-active', 'true');
  148 |   });
  149 | 
  150 |   test('keeps key mobile controls usable at 390px', async ({ page }) => {
  151 |     await page.setViewportSize({ width: 390, height: 1100 });
  152 |     await gotoHome(page);
  153 | 
  154 |     await expect(page.locator('[data-section="hero"] #hero-title')).toBeVisible();
  155 |     await expect(page.locator('[data-section="hero"] .anh-landing-hero__bottle')).toBeVisible();
  156 |     await expect(page.locator('[data-section="hero"] .anh-button').first()).toBeVisible();
  157 |     await expect(page.locator('[data-section="highlights"] .anh-carousel-dock')).toBeVisible();
  158 |     await expect(page.locator('[data-section="comparison"] .anh-compare-card').first()).toBeVisible();
  159 | 
  160 |     const clippedButtons = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.apple-nafas-page .anh-button, .apple-nafas-page button')]
  161 |       .filter((element) => {
  162 |         if (element.closest('[aria-hidden="true"]')) return false;
  163 |         if (element.offsetParent === null) return false;
  164 |         if ('checkVisibility' in element && !element.checkVisibility({ checkVisibilityCSS: true })) return false;
  165 |         const rect = element.getBoundingClientRect();
  166 |         return rect.width < 32 || rect.height < 32 || rect.left < -1 || rect.right > window.innerWidth + 1;
  167 |       })
  168 |       .map((element) => {
  169 |         const rect = element.getBoundingClientRect();
  170 |         return {
  171 |           className: element.className,
  172 |           label: element.textContent?.trim(),
  173 |           section: element.closest('[data-section]')?.getAttribute('data-section'),
  174 |           parentClass: element.parentElement?.className,
  175 |           rect: { height: rect.height, left: rect.left, right: rect.right, width: rect.width },
  176 |         };
  177 |       }));
  178 | 
> 179 |     expect(clippedButtons).toEqual([]);
      |                            ^ Error: expect(received).toEqual(expected) // deep equality
  180 |     await expectNoHorizontalOverflow(page);
  181 |   });
  182 | 
  183 |   test('does not leave custom cursor or pointer-following artifacts in the DOM', async ({ page }) => {
  184 |     await gotoHome(page);
  185 | 
  186 |     await expect(page.locator('.custom-cursor, .cursor-dot, .cursor-ring')).toHaveCount(0);
  187 | 
  188 |     const cursorStyles = await page.evaluate(() => [...document.styleSheets]
  189 |       .flatMap((sheet) => {
  190 |         try {
  191 |           return [...sheet.cssRules].map((rule) => rule.cssText);
  192 |         } catch {
  193 |           return [];
  194 |         }
  195 |       })
  196 |       .some((cssText) => cssText.includes('cursor-dot') || cssText.includes('cursor-ring')));
  197 | 
  198 |     expect(cursorStyles).toBe(false);
  199 |   });
  200 | });
  201 | 
```