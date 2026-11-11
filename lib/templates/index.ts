export interface DiagramTemplate {
  id: string;
  name: string;
  category: "UML Behavioral" | "UML Structural" | "System Design" | "General";
  description: string;
  xml: string;
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: "use-case",
    name: "Use Case Diagram",
    category: "UML Behavioral",
    description: "System boundary with actors, primary use cases, and <<include>> / <<extend>> relationships.",
    xml: `<mxfile host="app.diagrams.net">
  <diagram id="use-case-1" name="Use Case">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Software Engineering Learning System" style="shape=rect;html=1;whiteSpace=wrap;strokeWidth=2;fillColor=#f8fafc;strokeColor=#475569;verticalAlign=top;fontStyle=1;fontSize=14;spacingTop=10;" vertex="1" parent="1">
          <mxGeometry x="220" y="80" width="380" height="420" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="Student" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#e0e7ff;strokeColor=#4338ca;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="80" y="210" width="40" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="View Syllabus &amp;amp; Notes" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="310" y="130" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Practice 6-Mark Q&amp;amp;A" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="310" y="220" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="6" value="Draw UML Diagrams" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="310" y="310" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="7" value="Authenticate User" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=2;" vertex="1" parent="1">
          <mxGeometry x="400" y="410" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="8" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#334155;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="4">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="9" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#334155;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="5">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="10" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#334155;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="6">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="11" value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;strokeWidth=1.5;strokeColor=#b45309;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" edge="1" parent="1" source="6" target="7">
          <mxGeometry width="160" relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,
  },
  {
    id: "class-diagram",
    name: "UML Class Diagram",
    category: "UML Structural",
    description: "Standard 3-compartment class notation with attributes, methods, and associations.",
    xml: `<mxfile host="app.diagrams.net">
  <diagram id="class-1" name="Class Diagram">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Student&#xa;--&#xa;- rollNo : int&#xa;- name : String&#xa;- attendancePct : double&#xa;--&#xa;+ registerCourse() : void&#xa;+ viewMarks() : void" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="120" y="160" width="180" height="150" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="Course&#xa;--&#xa;- courseCode : String&#xa;- title : String&#xa;- credits : int&#xa;--&#xa;+ getSyllabus() : String&#xa;+ evaluateGrades() : void" style="swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;fillColor=#f0fdf4;strokeColor=#22c55e;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="460" y="160" width="190" height="150" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="enrolls in" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#334155;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="2" target="3">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="1..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=bottom;" connectable="0" vertex="1" parent="4">
          <mxGeometry x="-0.8" relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="6" value="1..*" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;" connectable="0" vertex="1" parent="4">
          <mxGeometry x="0.8" relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,
  },
  {
    id: "sequence-diagram",
    name: "Sequence Diagram",
    category: "UML Behavioral",
    description: "Time-ordered interaction sequence between user, frontend, service, and database.",
    xml: `<mxfile host="app.diagrams.net">
  <diagram id="seq-1" name="Sequence Diagram">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="User" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="100" height="340" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="Client UI" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#e0e7ff;strokeColor=#4338ca;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="280" y="100" width="100" height="340" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="Auth Service" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="460" y="100" width="100" height="340" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Database" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#dcfce7;strokeColor=#16a34a;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="640" y="100" width="100" height="340" as="geometry"/>
        </mxCell>
        <mxCell id="6" value="1: submitLogin(credentials)" style="html=1;verticalAlign=bottom;endArrow=block;strokeWidth=1.5;strokeColor=#1e293b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="150" y="170" as="sourcePoint"/>
            <mxPoint x="330" y="170" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="7" value="2: verifyUser(email, hash)" style="html=1;verticalAlign=bottom;endArrow=block;strokeWidth=1.5;strokeColor=#1e293b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="330" y="200" as="sourcePoint"/>
            <mxPoint x="510" y="200" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="8" value="3: findOne({ email })" style="html=1;verticalAlign=bottom;endArrow=block;strokeWidth=1.5;strokeColor=#1e293b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="510" y="230" as="sourcePoint"/>
            <mxPoint x="690" y="230" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="9" value="4: return userDoc" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;strokeWidth=1.5;strokeColor=#64748b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="690" y="270" as="sourcePoint"/>
            <mxPoint x="510" y="270" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="10" value="5: JWT session token" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;strokeWidth=1.5;strokeColor=#64748b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="510" y="310" as="sourcePoint"/>
            <mxPoint x="330" y="310" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="11" value="6: renderDashboard()" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;strokeWidth=1.5;strokeColor=#64748b;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="330" y="350" as="sourcePoint"/>
            <mxPoint x="150" y="350" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,
  },
  {
    id: "activity-diagram",
    name: "Activity Diagram",
    category: "UML Behavioral",
    description: "Initial state, actions, decisions, branch paths, and final state.",
    xml: `<mxfile host="app.diagrams.net">
  <diagram id="act-1" name="Activity Diagram">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="" style="ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="385" y="80" width="30" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="Enter ATM Card &amp;amp; PIN" style="rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#e0f2fe;strokeColor=#0284c7;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="320" y="140" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="PIN Valid?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#d97706;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="350" y="230" width="100" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Display Error &amp;amp; Eject Card" style="rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#fee2e2;strokeColor=#dc2626;strokeWidth=2;" vertex="1" parent="1">
          <mxGeometry x="510" y="235" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="6" value="Select Withdrawal &amp;amp; Amount" style="rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#e0f2fe;strokeColor=#0284c7;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="320" y="330" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="7" value="Dispense Cash &amp;amp; Receipt" style="rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#dcfce7;strokeColor=#16a34a;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="320" y="420" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="8" value="" style="ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#000000;" vertex="1" parent="1">
          <mxGeometry x="385" y="510" width="30" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="9" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#334155;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="2" target="3"/>
        <mxCell id="10" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#334155;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="4"/>
        <mxCell id="11" value="[No]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#dc2626;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="4" target="5"/>
        <mxCell id="12" value="[Yes]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#16a34a;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="4" target="6"/>
        <mxCell id="13" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#334155;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="6" target="7"/>
        <mxCell id="14" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#334155;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="7" target="8"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,
  },
  {
    id: "dfd-diagram",
    name: "Data Flow Diagram (DFD)",
    category: "System Design",
    description: "External entities, circular process transforms, and open data stores.",
    xml: `<mxfile host="app.diagrams.net">
  <diagram id="dfd-1" name="DFD Level 1">
    <mxGraphModel dx="1000" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Student" style="shape=rect;whiteSpace=wrap;html=1;fillColor=#f1f5f9;strokeColor=#475569;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="180" width="120" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="1.0&#xa;Search &amp;amp; Verify Book" style="shape=ellipse;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#2563eb;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="340" y="160" width="130" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="D1 | Book Catalog" style="shape=partialRectangle;top=0;bottom=0;fillColor=#fef3c7;strokeColor=#d97706;strokeWidth=2;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="580" y="185" width="160" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Book Request [ISBN]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#1e293b;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="2" target="3"/>
        <mxCell id="6" value="Query Availability" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#1e293b;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="4"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,
  },
];

