+++
title="Teilautomatisierte Erstellung von Gleichstellungskonzepten"
description="Um die Gleichstellung in bayerischen Behörden zu fördern, werden regelmäßig Gleichstellungskonzepte erstellt. Auf Basis von gemeinsam erarbeiteten Musterkonzepten und in Integration mit unserer Software reportix kann dies nun teilautomatisiert werden."
date=2026-06-01

[taxonomies]
type=["Produkt", "Schulung + Support", "Hosting"]
tag=["Open Source", "Reporting"]

[extra]
logo="Logo_StMAS.png"
resources=[
  { title = "Webapp Gleichstellungskonzepte", url = "https://gleichstellung.bayern.ondatix.org/" },
  { title = "Handbuch", url = "https://handbuch.gleichstellung.bayern.ondatix.org/" },
]
related_projects=[
  { path = "projekte/reportix/index.md" },
]

# cards=[
#   { title = "Musterkonzept", content = "Hier kann man den Protypen für das Musterkonzept herunterladen [Prototyp](Musterkonzept.zip)." },
# ]
+++

### reportix für Gleichstellungskonzepte

Bayerische Dienststellen, d.h. staatlichen Stellen, Kommune, Landkreise, kreisfreie Städte und Bezirke, sind ab einer bestimmten Anzahl Beschäftigter gesetzlich dazu verpflichtet, alle fünf Jahre Gleichstellungskonzepte zu erstellen.
Grundlage der Gleichstellungskonzepte ist die Beschreibung der Situation der weiblichen Beschäftigten im Vergleich zu den männlichen Beschäftigten, z.B. in Bezug auf Führungspositionen oder Teilzeitbeschäftigung.
Aus diesen Datenübersichten werden Initiativen und strukturelle Maßnahmen zur Sicherung von Chancengleichheit von Frauen und Männern und der Vereinbarkeit von Familie und Beruf in den Dienststellen abgeleitet und in die Konzepte aufgenommen.

Die Erstellung der Gleichstellungskonzepte war bisher ein aufwändiger, in weiten Teilen manueller Prozess, der in den Dienststellen viele Ressourcen gebunden hat.
Vor diesem Hintergrund war es dem StMAS ein Anliegen, die Erstellung von Datenübersichten und Gleichstellungskonzepten zu vereinfachen, indem vorhandene Datenquellen herangezogen, Analysen automatisiert und die Konzepterstellung möglichst digitalisiert werden.

Dafür haben wir auf Basis unserer modularen Software [reportix](@/projekte/reportix/index.md) eine [Webapp](https://gleichstellung.bayern.ondatix.org/) entwickelt, mit der die Datenauswertung einheitlich und effizient gelingt.
Die Webapp steht den Dienststellen ab sofort zur Verfügung.
Ein [Handbuch](https://handbuch.gleichstellung.bayern.ondatix.org/) führt Schritt für Schritt durch die Erstellung eines Gleichstellungskonzepts.

<div class="flow">
    <div class="flow-step">Personaldaten</div>
    <div class="flow-arrow" aria-hidden="true">⟶</div>
    <div class="flow-step highlight">Angepasste reportix Webapp</div>
    <div class="flow-arrow" aria-hidden="true">⟶</div>
    <div class="flow-step">Gleichstellungskonzept</div>
</div>
